var Election = artifacts.require("./Adoption.sol");

contract("Election", function(accounts) {
  var electionInstance;

  it("initializes with two candidates", function() {
    return Election.deployed().then(function(instance) {
      return instance.candidatesCount();
    }).then(function(count) {
      assert.equal(count, 16);
    });
  });

  it("it initializes the candidates with the correct values", function() {
    return Election.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.candidates(1);
    }).then(function(candidate) {
      assert.equal(candidate[0], 1, "contains the correct id");
      assert.equal(candidate[1], "Frieda - Scottish Terrier", "contains the correct name");
      assert.equal(candidate[2], 0, "contains the correct votes count");
      return electionInstance.candidates(2);
    }).then(function(candidate) {
      assert.equal(candidate[0], 2, "contains the correct id");
      assert.equal(candidate[1], "Gina - Scottish Terrier", "contains the correct name");
      assert.equal(candidate[2], 0, "contains the correct votes count");
      return electionInstance.candidates(3);
    }).then(function(candidate) {
      assert.equal(candidate[0], 3, "contains the correct id");
      assert.equal(candidate[1], "Collins - French Bulldog", "contains the correct name");
      assert.equal(candidate[2], 0, "contains the correct votes count");
      return electionInstance.candidates(4);
    }).then(function(candidate) {
      assert.equal(candidate[0], 4, "contains the correct id");
      assert.equal(candidate[1], "Melissa - Boxer", "contains the correct name");
      assert.equal(candidate[2], 0, "contains the correct votes count");
       return electionInstance.candidates(5);
    }).then(function(candidate) {
      assert.equal(candidate[0], 5, "contains the correct id");
      assert.equal(candidate[1], "Jeanine - French Bulldog", "contains the correct name");
      assert.equal(candidate[2], 0, "contains the correct votes count");
      return electionInstance.candidates(6);
    }).then(function(candidate) {
      assert.equal(candidate[0], 6, "contains the correct id");
      assert.equal(candidate[1], "Elvia - French Bulldog", "contains the correct name");
      assert.equal(candidate[2], 0, "contains the correct votes count");
      return electionInstance.candidates(7);
    }).then(function(candidate) {
      assert.equal(candidate[0], 7, "contains the correct id");
      assert.equal(candidate[1], "Lathisa - Golden Retriever", "contains the correct name");
      assert.equal(candidate[2], 0, "contains the correct votes count");
      return electionInstance.candidates(8);
    }).then(function(candidate) {
      assert.equal(candidate[0], 8, "contains the correct id");
      assert.equal(candidate[1], "Coleman - Golden Retriever", "contains the correct name");
      assert.equal(candidate[2], 0, "contains the correct votes count");
      return electionInstance.candidates(9);
    }).then(function(candidate) {
      assert.equal(candidate[0], 9, "contains the correct id");
      assert.equal(candidate[1], "Nichole - French Bulldog", "contains the correct name");
      assert.equal(candidate[2], 0, "contains the correct votes count");
      return electionInstance.candidates(10);
    }).then(function(candidate) {
      assert.equal(candidate[0], 10, "contains the correct id");
      assert.equal(candidate[1], "Fran - Boxer", "contains the correct name");
      assert.equal(candidate[2], 0, "contains the correct votes count");
      return electionInstance.candidates(11);
    }).then(function(candidate) {
      assert.equal(candidate[0], 11, "contains the correct id");
      assert.equal(candidate[1], "Leonor - Boxer", "contains the correct name");
      assert.equal(candidate[2], 0, "contains the correct votes count");
      return electionInstance.candidates(12);
    }).then(function(candidate) {
      assert.equal(candidate[0], 12, "contains the correct id");
      assert.equal(candidate[1], "Dean - Scottish Terrier", "contains the correct name");
      assert.equal(candidate[2], 0, "contains the correct votes count");
      return electionInstance.candidates(13);
    }).then(function(candidate) {
      assert.equal(candidate[0], 13, "contains the correct id");
      assert.equal(candidate[1], "Stevenson - French Bulldog", "contains the correct name");
      assert.equal(candidate[2], 0, "contains the correct votes count");
      return electionInstance.candidates(14);
    }).then(function(candidate) {
      assert.equal(candidate[0], 14, "contains the correct id");
      assert.equal(candidate[1], "Kristina - Golden Retriever", "contains the correct name");
      assert.equal(candidate[2], 0, "contains the correct votes count");
      return electionInstance.candidates(15);
    }).then(function(candidate) {
      assert.equal(candidate[0], 15, "contains the correct id");
      assert.equal(candidate[1], "Ethel - Golden Retriever", "contains the correct name");
      assert.equal(candidate[2], 0, "contains the correct votes count");
      return electionInstance.candidates(16);
    }).then(function(candidate) {
      assert.equal(candidate[0], 16, "contains the correct id");
      assert.equal(candidate[1], "Terry - Golden Retriever", "contains the correct name");
      assert.equal(candidate[2], 0, "contains the correct votes count");
    });
  });
  it("allows a voter to cast a vote", function() {
    return Election.deployed().then(function(instance) {
      electionInstance = instance;
      candidateId = 1;
      return electionInstance.vote(candidateId, { from: accounts[0] });
    }).then(function(receipt) {
      return electionInstance.voters(accounts[0]);
    }).then(function(voted) {
      assert(voted, "the voter was marked as voted");
      return electionInstance.candidates(candidateId);
    }).then(function(candidate) {
      var voteCount = candidate[2];
      assert.equal(voteCount, 1, "increments the candidate's vote count");
    })
  });
  it("throws an exception for invalid candidates", function() {
    return Election.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.vote(99, { from: accounts[1] })
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
      return electionInstance.candidates(1);
    }).then(function(candidate1) {
      var voteCount = candidate1[2];
      assert.equal(voteCount, 1, "candidate 1 did not receive any votes");
      return electionInstance.candidates(2);
    }).then(function(candidate2) {
      var voteCount = candidate2[2];
      assert.equal(voteCount, 0, "candidate 2 did not receive any votes");
    });
  });
  it("throws an exception for double voting", function() {
    return Election.deployed().then(function(instance) {
      electionInstance = instance;
      candidateId = 2;
      electionInstance.vote(candidateId, { from: accounts[1] });
      return electionInstance.candidates(candidateId);
    }).then(function(candidate) {
      var voteCount = candidate[2];
      assert.equal(voteCount, 1, "accepts first vote");
      // Try to vote again
      return electionInstance.vote(candidateId, { from: accounts[1] });
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
      return electionInstance.candidates(1);
    }).then(function(candidate1) {
      var voteCount = candidate1[2];
      assert.equal(voteCount, 1, "candidate 1 did not receive any votes");
      return electionInstance.candidates(2);
    }).then(function(candidate2) {
      var voteCount = candidate2[2];
      assert.equal(voteCount, 1, "candidate 2 did not receive any votes");
    });
  });
});