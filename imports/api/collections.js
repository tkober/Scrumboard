export const Boards = new Mongo.Collection('boards');
export const Lines = new Mongo.Collection('lines');

export const Scrums = new Mongo.Collection('scrums');

if (Meteor.isServer) {

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

  Meteor.publish('boards', function() {
    return Boards.find({
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

  Meteor.publish('lines', function() {
    return Lines.find({}, {});
  });


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
        backlog: []
      });
    },

    'scrums.get' (id) {
      if (!Meteor.userId()) {
        throw new Meteor.Error('not-authorized');
      }

      scrum = Scrums.findOne({
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
      });

      if (!scrum) {
        throw new Meteor.Error(400, 'The requested scrum either does not exist or you do not have the requiered permission!');
      }
      return scrum;
    },

    'scrums.update' (id, name, participants) {
      if (!Meteor.userId()) {
        throw new Meteor.Error('not-authorized');
      }

      scrum = Scrums.findOne({ _id: id, owner: Meteor.userId() });
      if (!scrum) {
        throw new Meteor.Error(401, 'You do not have the requiered permission to perform this action!');
      }

      Scrums.update(
        {
          _id: id,
          owner: Meteor.userId()
        }, {
          $set: {
            'name': name,
            'participants': participants
          }
        }
      );
    },

    'scrums.delete' (id) {
      if (!Meteor.userId()) {
        throw new Meteor.Error('not-authorized');
      }

      scrum = Scrums.findOne({ _id: id, owner: Meteor.userId() });
      if (!scrum) {
        throw new Meteor.Error(401, 'You do not have the requiered permission to perform this action!');
      }

      Scrums.remove({
        _id: id,
        owner: Meteor.userId()
      });
    },

    'scrums.personas.create' (name, scrumId) {
      if (!Meteor.userId()) {
        throw new Meteor.Error('not-authorized');
      }

      scrum = Scrums.findOne({ _id: scrumId, owner: Meteor.userId() });
      if (!scrum) {
        throw new Meteor.Error(401, 'You do not have the requiered permission to perform this action!');
      }

      for (i = 0; i < scrum.personas.length; i++) {
        persona = scrum.personas[i];
        if (persona.name.toUpperCase() === name.toUpperCase()) {
          throw new Meteor.Error(400, 'A person with that name already exists for the specified scrum!');
        }
      }

      persona = { 'name': name };
      scrum.personas.push(persona);

      Scrums.update(
        {
          _id: scrumId,
          owner: Meteor.userId()
        }, {
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

    'scrums.userstories.create' (epic, personas, acceptanceCriteria, goal, reason, scrumId) {
      if (!Meteor.userId()) {
        throw new Meteor.Error('not-authorized');
      }

      scrum = Scrums.findOne({ _id: scrumId, owner: Meteor.userId() });
      if (!scrum) {
        throw new Meteor.Error(401, 'You do not have the requiered permission to perform this action!');
      }

      storyId = storyIdForScrum(scrum);
      story = {
        'id': storyId,
        'epic': epic,
        'personas': JSON.parse(personas),
        'acceptanceCriteria': JSON.parse(acceptanceCriteria),
        'goal': goal,
        'reason': reason,
        'estimates': {}
      };
      scrum.backlog.push(story);

      Scrums.update(
        {
          _id: scrumId,
          owner: Meteor.userId()
        }, {
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

      scrum = Scrums.findOne({ _id: scrumId, owner: Meteor.userId() });
      if (!scrum) {
        throw new Meteor.Error(401, 'You do not have the requiered permission to perform this action!');
      }

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

      Scrums.update(
        {
          _id: scrumId,
          owner: Meteor.userId()
        }, {
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

      scrum = Scrums.findOne({ _id: scrumId, owner: Meteor.userId() });
      if (!scrum) {
        throw new Meteor.Error(401, 'You do not have the requiered permission to perform this action!');
      }

      for (var i = 1; i < scrum.backlog.length; i++) {
        if (scrum.backlog[i].id == storyId) {
          var temp = scrum.backlog[i];
          scrum.backlog[i] = scrum.backlog[i-1];
          scrum.backlog[i-1] = temp;
          break;
        }
      }

      Scrums.update(
        {
          _id: scrumId
        }, {
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

      scrum = Scrums.findOne({ _id: scrumId, owner: Meteor.userId() });
      if (!scrum) {
        throw new Meteor.Error(401, 'You do not have the requiered permission to perform this action!');
      }

      for (var i = 0; i < scrum.backlog.length-1; i++) {
        if (scrum.backlog[i].id == storyId) {
          var temp = scrum.backlog[i];
          scrum.backlog[i] = scrum.backlog[i+1];
          scrum.backlog[i+1] = temp;
          break;
        }
      }

      Scrums.update(
        {
          _id: scrumId
        }, {
          $set: {
            'backlog': scrum.backlog
          }
        }
      );
    }

  });
}
