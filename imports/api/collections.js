export const Scrums = new Mongo.Collection('scrums');

if (Meteor.isServer) {

  var scrumUpdateSelector = function(id) {
    return {
      '$and': [
        {
          _id: id
        },
        {
          '$or': [
            { owner: Meteor.userId() },
            { participants: Meteor.userId() }
          ]
        }
      ]
    };
  };

  var getScrum = function(id) {
    var result = Scrums.findOne(scrumUpdateSelector(id));
    if (!result) {
      throw new Meteor.Error(401, 'You do not have the requiered permission to perform this action!');
    }
    return result;
  };

  var burndownSnapshot = function(sprint_backlog) {
    var result = { timestamp: new Date(), todo: 0, inProgress: 0, review: 0, done: 0 };
    for (var i = 0; i < sprint_backlog.length; i++) {
      var story = sprint_backlog[i];
      for (status in story.tasks) {
        result[status] += story.tasks[status].length;
      }
    }
    return result;
  };

  storyIdForScrum = function(scrum) {
    guid = function() {
      function S4() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
      }
      return (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
    };

    storyIdUsed = function(scrum, sid) {
      for (var i = 0; i < scrum.backlog.length; i++) {
        if (scrum.backlog[i].id === sid) {
          return true;
        }
      }

      return false;
    };

    result = guid();
    while (storyIdUsed(scrum, result)) {
      result = guid();
    }
    return result;
  };

  Meteor.publish('scrums', function() {
    return Scrums.find({
      '$or': [
        { owner: this.userId },
        { participants: this.userId }
      ]
    }, {
      sort: {
        date: 1
      }
    });
  });

  Meteor.methods({

    // Users
    'users.get' () {
      if (!Meteor.userId()) {
        throw new Meteor.Error('not-authorized');
      }
      users = Meteor.users.find({}).fetch();
      result = [];
      for (i = 0; i < users.length; i++) {
        user = users[i];
        result.push({
          _id: user._id,
          email: user.emails[0].address
        });
      }
      return result;
    },


    // Scrums
    'scrums.create' (name, participants) {
      if (!Meteor.userId()) {
        throw new Meteor.Error('not-authorized');
      }

      return Scrums.insert({
        owner: Meteor.userId(),
        name: name,
        createdAt: Date.now(),
        participants: JSON.parse(participants),
        personas: [],
        backlog: [],
        sprint: null
      });
    },

    'scrums.get' (id) {
      if (!Meteor.userId()) {
        throw new Meteor.Error('not-authorized');
      }

      scrum = getScrum(id);
      return scrum;
    },

    'scrums.update' (id, name, participants) {
      if (!Meteor.userId()) {
        throw new Meteor.Error('not-authorized');
      }

      // Ceck permission
      scrum = getScrum(id);
      Scrums.update(
        {
          _id: id,
          owner: Meteor.userId()
        }, {
          $set: {
            'name': name,
            'participants': JSON.parse(participants)
          }
        }
      );
    },

    'scrums.delete' (id) {
      if (!Meteor.userId()) {
        throw new Meteor.Error('not-authorized');
      }

      // Ceck permission
      scrum = getScrum(id);

      Scrums.remove({
        _id: id,
        owner: Meteor.userId()
      });
    },

    'scrums.personas.create' (name, scrumId) {
      if (!Meteor.userId()) {
        throw new Meteor.Error('not-authorized');
      }

      // Ceck permission
      scrum = getScrum(scrumId);

      for (i = 0; i < scrum.personas.length; i++) {
        persona = scrum.personas[i];
        if (persona.name.toUpperCase() === name.toUpperCase()) {
          throw new Meteor.Error(400, 'A person with that name already exists for the specified scrum!');
        }
      }

      persona = { 'name': name };
      scrum.personas.push(persona);

      Scrums.update(scrumUpdateSelector(scrumId), {
          $set: {
            'personas': scrum.personas
          }
        }
      );
    },

    'scrums.personas.get' (id) {
      scrum = Meteor.call('scrums.get', id);
      return scrum.personas;
    },

    'scrums.userstories.create' (epic, personas, acceptanceCriteria, goal, reason, scrumId, intranet, redmine) {
      if (!Meteor.userId()) {
        throw new Meteor.Error('not-authorized');
      }

      // Ceck permission
      scrum = getScrum(scrumId);

      storyId = storyIdForScrum(scrum);
      story = {
        'id': storyId,
        'epic': epic,
        'personas': JSON.parse(personas),
        'acceptanceCriteria': JSON.parse(acceptanceCriteria),
        'goal': goal,
        'reason': reason,
        'estimates': {},
        'intranet': intranet,
        'redmine': redmine
      };
      scrum.backlog.push(story);

      Scrums.update(scrumUpdateSelector(scrumId), {
          $set: {
            'backlog': scrum.backlog
          }
        }
      );
    },

    'scrums.userstories.delete' (scrumId, storyId) {
      if (!Meteor.userId()) {
        throw new Meteor.Error('not-authorized');
      }

      // Ceck permission
      scrum = getScrum(scrumId);

      var story = null;
      for (var i = 0; i < scrum.backlog.length; i++) {
        s = scrum.backlog[i];
        if (s.id === storyId) {
          story = s;
          break;
        }
      }
      if (story == null) {
        throw new Meteor.Error(400, 'There is no backlog item with the specified id');
      }
      scrum.backlog.splice(i, 1);

      Scrums.update(scrumUpdateSelector(scrumId), {
          $set: {
            'backlog': scrum.backlog
          }
        }
      );
    },

    'scrums.userstories.get' (scrumId, storyId) {
      if (!Meteor.userId()) {
        throw new Meteor.Error('not-authorized');
      }

      // Ceck permission
      scrum = getScrum(scrumId);

      var story = null;
      for (var i = 0; i < scrum.backlog.length; i++) {
        s = scrum.backlog[i];
        if (s.id === storyId) {
          story = s;
          break;
        }
      }
      if (story == null) {
        throw new Meteor.Error(400, 'There is no backlog item with the specified id');
      }

      return story;
    },

    'scrums.userstories.update' (storyId, epic, personas, acceptanceCriteria, goal, reason, scrumId, intranet, redmine) {
      if (!Meteor.userId()) {
        throw new Meteor.Error('not-authorized');
      }

      // Ceck permission
      scrum = getScrum(scrumId);

      var story = null;
      for (var i = 0; i < scrum.backlog.length; i++) {
        s = scrum.backlog[i];
        if (s.id === storyId) {
          story = s;
          break;
        }
      }
      if (story == null) {
        throw new Meteor.Error(400, 'There is no backlog item with the specified id');
      }
      story.epic = epic;
      story.personas = JSON.parse(personas);
      story.acceptanceCriteria = JSON.parse(acceptanceCriteria);
      story.goal = goal;
      story.reason = reason;
      story.estimates = {};
      story.intranet = intranet;
      story.redmine = redmine;

      Scrums.update(scrumUpdateSelector(scrumId), {
          $set: {
            'backlog': scrum.backlog
          }
        }
      );
    },

    'scrums.userstories.estimate' (scrumId, storyId, estimate) {
      if (!Meteor.userId()) {
        throw new Meteor.Error('not-authorized');
      }

      // Ceck permission
      scrum = getScrum(scrumId);

      var story = null;
      for (var i = 0; i < scrum.backlog.length; i++) {
        s = scrum.backlog[i];
        if (s.id === storyId) {
          story = s;
        }
      }
      if (story == null) {
        throw new Meteor.Error(400, 'There is no backlog item with the specified id');
      }
      story.estimates[Meteor.userId()] = estimate;

      Scrums.update(scrumUpdateSelector(scrumId), {
          $set: {
            'backlog': scrum.backlog
          }
        }
      );
    },

    'scrums.userstories.upvote' (scrumId, storyId) {
      if (!Meteor.userId()) {
        throw new Meteor.Error('not-authorized');
      }

      // Ceck permission
      scrum = getScrum(scrumId);

      for (var i = 1; i < scrum.backlog.length; i++) {
        if (scrum.backlog[i].id == storyId) {
          var temp = scrum.backlog[i];
          scrum.backlog[i] = scrum.backlog[i-1];
          scrum.backlog[i-1] = temp;
          break;
        }
      }

      Scrums.update(scrumUpdateSelector(scrumId), {
          $set: {
            'backlog': scrum.backlog
          }
        }
      );
    },

    'scrums.userstories.downvote' (scrumId, storyId) {
      if (!Meteor.userId()) {
        throw new Meteor.Error('not-authorized');
      }

      // Ceck permission
      scrum = getScrum(scrumId);

      for (var i = 0; i < scrum.backlog.length-1; i++) {
        if (scrum.backlog[i].id == storyId) {
          var temp = scrum.backlog[i];
          scrum.backlog[i] = scrum.backlog[i+1];
          scrum.backlog[i+1] = temp;
          break;
        }
      }

      Scrums.update(scrumUpdateSelector(scrumId), {
          $set: {
            'backlog': scrum.backlog
          }
        }
      );
    },

    'scrums.sprint.start_planning' (scrumId, begin, end, planningParticipants) {
      if (!Meteor.userId()) {
        throw new Meteor.Error('not-authorized');
      }

      // Ceck permission
      scrum = getScrum(scrumId);

      if (scrum.sprint != null) {
        throw new Meteor.Error(400, 'There is already a pending sprint');
      }

      if (begin >= end) {
        throw new Meteor.Error(400, 'Begin needs to be at least one day before the end');
      }

      Scrums.update(scrumUpdateSelector(scrumId), {
          $set: {
            'sprint': {
              'status': 'planning',
              'begin': begin,
              'end': end,
              'planningParticipants': JSON.parse(planningParticipants),
              'backlog': [],
              'burndown': [],
              'retrospective': {
                'good': [],
                'poor': [],
                'try': [],
                'keep': [],
                'drop': []
              }
            }
          }
        }
      );
    },

    'scrums.userstories.reset_estimate' (scrumId, storyId) {
      if (!Meteor.userId()) {
        throw new Meteor.Error('not-authorized');
      }

      // Ceck permission
      scrum = getScrum(scrumId);

      var story = null;
      for (var i = 0; i < scrum.backlog.length; i++) {
        s = scrum.backlog[i];
        if (s.id === storyId) {
          story = s;
        }
      }
      if (story == null) {
        throw new Meteor.Error(400, 'There is no backlog item with the specified id');
      }
      story.estimates = {};

      Scrums.update(scrumUpdateSelector(scrumId), {
          $set: {
            'backlog': scrum.backlog
          }
        }
      );
    },

    'scrums.sprint.backlog.add' (scrumId, storyId) {
      if (!Meteor.userId()) {
        throw new Meteor.Error('not-authorized');
      }

      // Ceck permission
      scrum = getScrum(scrumId);

      var story = null;
      for (var i = 0; i < scrum.backlog.length; i++) {
        s = scrum.backlog[i];
        if (s.id === storyId) {
          story = s;
        }
      }
      if (story == null) {
        throw new Meteor.Error(400, 'There is no backlog item with the specified id');
      }

      var backlog = scrum.sprint.backlog;
      if (backlog.indexOf(storyId) != -1) {
        throw new Meteor.Error(400, 'A reference with the given id already exists in the sprint backlog');
      }
      backlog.push(storyId);

      Scrums.update(scrumUpdateSelector(scrumId), {
          $set: {
            'sprint.backlog': backlog
          }
        }
      );
    },

    'scrums.sprint.backlog.remove' (scrumId, storyId) {
      if (!Meteor.userId()) {
        throw new Meteor.Error('not-authorized');
      }

      // Ceck permission
      scrum = getScrum(scrumId);

      var story = null;
      for (var i = 0; i < scrum.backlog.length; i++) {
        s = scrum.backlog[i];
        if (s.id === storyId) {
          story = s;
        }
      }
      if (story == null) {
        throw new Meteor.Error(400, 'There is no backlog item with the specified id');
      }

      var backlog = scrum.sprint.backlog;
      var index = backlog.indexOf(storyId);
      if (index == -1) {
        throw new Meteor.Error(400, 'The story with the spacified id has not been added to the sprint backlog yet');
      }

      backlog.splice(index, 1);
      Scrums.update(scrumUpdateSelector(scrumId), {
          $set: {
            'sprint.backlog': backlog
          }
        }
      );
    },

    'scrums.sprint.start' (scrumId) {
      if (!Meteor.userId()) {
        throw new Meteor.Error('not-authorized');
      }

      // Ceck permission
      scrum = getScrum(scrumId);

      if (scrum.sprint == null) {
        throw new Meteor.Error(400, 'There is no pending sprint');
      }

      if (scrum.sprint.status != 'planning') {
        throw new Meteor.Error(400, 'The pending sprint cannot be started');
      }

      var sprint_backlog = [];
      for (var i = 0; i < scrum.backlog.length; i++) {
        var story = scrum.backlog[i];
        if (scrum.sprint.backlog.indexOf(story.id) != -1) {
          story.estimate = story.estimates[Meteor.userId()];
          story.tasks = { todo: [], inProgress: [], review: [], done:[] };
          sprint_backlog.push(story);
          scrum.backlog.splice(i, 1)
          i--;
        }
      }

      Scrums.update(scrumUpdateSelector(scrumId), {
          $set: {
            'sprint.status': 'active',
            'sprint.backlog': sprint_backlog,
            'backlog': scrum.backlog
          }
        }
      );
    },

    'scrums.sprint.cancel_planning' (scrumId) {
      if (!Meteor.userId()) {
        throw new Meteor.Error('not-authorized');
      }

      // Ceck permission
      scrum = getScrum(scrumId);

      if (scrum.sprint == null) {
        throw new Meteor.Error(400, 'There is no pending sprint');
      }

      if (scrum.sprint.status != 'planning') {
        throw new Meteor.Error(400, 'The pending sprint cannot be canceled');
      }

      Scrums.update(scrumUpdateSelector(scrumId), {
          $set: {
            'sprint': null
          }
        }
      );
    },

    'scrums.userstories.createTask' (scrumId, storyId, text, difficulty) {
      if (!Meteor.userId()) {
        throw new Meteor.Error('not-authorized');
      }

      // Ceck permission
      scrum = getScrum(scrumId);

      if (scrum.sprint == null || scrum.sprint.status != 'active') {
        throw new Meteor.Error(400, 'There is no active sprint');
      }

      var story = null;
      for (var i = 0; i < scrum.sprint.backlog.length; i++) {
        s = scrum.sprint.backlog[i];
        if (s.id === storyId) {
          story = s;
        }
      }
      if (story == null) {
        throw new Meteor.Error(400, 'There is no backlog item with the specified id');
      }

      story.tasks.todo.push({
        'text': text,
        'difficulty': difficulty,
        'workers': []
      });

      scrum.sprint.burndown.push(burndownSnapshot(scrum.sprint.backlog));

      Scrums.update(scrumUpdateSelector(scrumId), {
          $set: {
            'sprint.backlog': scrum.sprint.backlog,
            'sprint.burndown': scrum.sprint.burndown
          }
        }
      );
    },

    'taskboard.move' (scrumId, storyId, index, from, to) {
      if (!Meteor.userId()) {
        throw new Meteor.Error('not-authorized');
      }

      // Ceck permission
      scrum = getScrum(scrumId);

      if (scrum.sprint == null || scrum.sprint.status != 'active') {
        throw new Meteor.Error(400, 'There is no active sprint');
      }

      var story = null;
      for (var i = 0; i < scrum.sprint.backlog.length; i++) {
        s = scrum.sprint.backlog[i];
        if (s.id === storyId) {
          story = s;
        }
      }
      if (story == null) {
        throw new Meteor.Error(400, 'There is no backlog item with the specified id');
      }
      if (!story.tasks[from]) {
        throw new Meteor.Error(400, 'No tasks exist for given from status');
      }
      var fromList = story.tasks[from];
      if (index < 0 || index >= fromList.length) {
        throw new Meteor.Error(400, 'Index out of bounds');
      }
      if (!story.tasks[to]) {
        throw new Meteor.Error(400, 'No tasks exist for given to status');
      }
      var toList = story.tasks[to];
      var task = fromList.splice(index, 1)[0];
      var email = Meteor.user().emails[0].address;
      if (task.workers.indexOf(email) == -1) {
        task.workers.push(email);
      }
      toList.push(task);

      scrum.sprint.burndown.push(burndownSnapshot(scrum.sprint.backlog));

      Scrums.update(scrumUpdateSelector(scrumId), {
          $set: {
            'sprint.backlog': scrum.sprint.backlog,
            'sprint.burndown': scrum.sprint.burndown
          }
        }
      );

      if (to === 'done') {
        return true;
      } else {
        return false;
      }
    },


    'scrums.userstories.removeTask' (scrumId, storyId, index, status) {
      if (!Meteor.userId()) {
        throw new Meteor.Error('not-authorized');
      }

      // Ceck permission
      scrum = getScrum(scrumId);

      if (scrum.sprint == null || scrum.sprint.status != 'active') {
        throw new Meteor.Error(400, 'There is no active sprint');
      }

      var story = null;
      for (var i = 0; i < scrum.sprint.backlog.length; i++) {
        s = scrum.sprint.backlog[i];
        if (s.id === storyId) {
          story = s;
        }
      }
      if (story == null) {
        throw new Meteor.Error(400, 'There is no backlog item with the specified id');
      }
      if (!story.tasks[status]) {
        throw new Meteor.Error(400, 'No tasks exist for given status');
      }

      var list = story.tasks[status];
      if (index < 0 || index >= list.length) {
        throw new Meteor.Error(400, 'Index out of bounds');
      }
      list.splice(index, 1)[0];
      scrum.sprint.burndown.push(burndownSnapshot(scrum.sprint.backlog));

      Scrums.update(scrumUpdateSelector(scrumId), {
          $set: {
            'sprint.backlog': scrum.sprint.backlog,
            'sprint.burndown': scrum.sprint.burndown
          }
        }
      );
    },

    'scrums.retrospective.addItem' (scrumId, item, category) {
      if (!Meteor.userId()) {
        throw new Meteor.Error('not-authorized');
      }

      // Ceck permission
      scrum = getScrum(scrumId);

      if (scrum.sprint == null) {
        throw new Meteor.Error(400, 'There is no pending sprint');
      }

      var validCategories = ['good', 'poor', 'try', 'keep', 'drop'];
      if (validCategories.indexOf(category) == -1) {
        throw new Meteor.Error(400, 'Invalid category');
      }

      scrum.sprint.retrospective[category].push(item);

      Scrums.update(scrumUpdateSelector(scrumId), {
          $set: {
            'sprint.retrospective': scrum.sprint.retrospective,
          }
        }
      );
    },

    'scrums.sprint.end' (scrumId, storiesToDelete) {
      if (!Meteor.userId()) {
        throw new Meteor.Error('not-authorized');
      }

      // Ceck permission
      scrum = getScrum(scrumId);

      if (scrum.sprint == null || scrum.sprint.status != 'active') {
        throw new Meteor.Error(400, 'There is no active sprint');
      }

      scrum.sprint.storiesToDelete = JSON.parse(storiesToDelete);
      scrum.sprint.status = 'ended';

      Scrums.update(scrumUpdateSelector(scrumId), {
          $set: {
            'sprint': scrum.sprint,
          }
        }
      );
    },

    'scrums.sprint.retire' (scrumId) {
      if (!Meteor.userId()) {
        throw new Meteor.Error('not-authorized');
      }

      // Ceck permission
      scrum = getScrum(scrumId);

      if (scrum.sprint == null || scrum.sprint.status != 'ended') {
        throw new Meteor.Error(400, 'There is no ended sprint');
      }

      // Inverse to keep priorities
      for (var i = scrum.sprint.backlog.length-1; i >= 0; i--) {
        var story = scrum.sprint.backlog[i];
        if ((story.tasks.todo.length + story.tasks.inProgress.length + story.tasks.review.length) > 0) {
          if (scrum.sprint.storiesToDelete.indexOf(story.id) == -1) {
            delete story.tasks;
            delete story.estimate;
            story.estimates = {};
            scrum.backlog.unshift(story);
          }
        }
      }

      Scrums.update(scrumUpdateSelector(scrumId), {
          $set: {
            'backlog': scrum.backlog,
            'sprint': null
          }
        }
      );
    }

  });
}
