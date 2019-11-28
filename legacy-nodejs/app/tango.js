var fs = require('fs');
var base = require('./data');
var ObjectId = require('mongodb').ObjectId;
var spawn = require('child_process').spawn;

var Tango = function() {
  var scope = this;
  scope.count = 0;

  base.db.words.find({}, function(err, words) {
    scope.count = words.length;
  });

  scope.tango = function(req, res) {
    var t = new Date();
    var time = t.toLocaleString();
    var color = 'red'; // base.chooseColor(req.query.color);
    var settings = {
      title: '',
      main_color: color,
      second_color: color,
      color_value: 'red', //base.color_values[color[0]],
      color_value_second: 'blue' //base.color_values[color[1]]
    };

    if (req.query.page == 'add')
      res.render('Tango-add', settings);
    else if (req.query.page == 'list') {
      scope.renderList(req, res, settings, 'list');
    } else if (req.query.page == 'word') {
      scope.renderWord(req, res, settings);
    } else if (req.query.page == 'test') {
      scope.renderReviewHistory(req, res, settings, t);
    } else if (req.query.page == 'generate_review') {
      scope.clickGenerateReview(req, res, settings, t);
    } else if (req.query.page == 'password') {
      scope.setPassword(req, res);
    } else if (req.query.page == 'wall') {
      scope.renderList(req, res, settings, 'wall');
    } else {
      scope.renderList(req, res, settings, 'wall');
    }
    // res.render('Tango', settings);
  }

  scope.wordList = function(req, res) {
    var settings = {
      title: '',
      main_color: 'red',
      second_color: 'red',
      color_value: 'red', //base.color_values[color[0]],
      color_value_second: 'blue' //base.color_values[color[1]]
    };
    scope.renderList(req, res, settings, 'list');
  }

  scope.setPassword = function(req, res) {
    res.send('<!doctype html><head></head><body><a href="/">' + req.query.password + '</a><script>localStorage.password="' + req.query.password + '";</script></body>');
  }

  scope.addWord = function(req, res) {
    var time = (new Date()).toLocaleString();
    base.log(time, req.ip, 'POST Tango/AddWord', req.header('host'), req.query, req.url);
    if (req.body.password != scope.password) {
      res.send('fail: wrong password');
      return;
    }
    req.body.password = undefined;
    var data = req.body;
    data.id = scope.count;
    data.added = "false";
    data.addtime = 0;
    data.level = -1;
    data.review = -1;
    data.history = [];
    if (data.furansugo == "true") {
      scope.generateFrenchIPA(data, function(new_word) {
        scope.insertWord(req, res, new_word);
      });
    } else {
      scope.insertWord(req, res, data);
    }
  }

  scope.insertWord = function(req, res, data) {
    base.db['words'].find({
      "hiragana": data.hiragana,
      "kanji": data.kanji
    }, function(err, result) {
      if (result.length) {
        res.send("fail: already exist");
        return;
      }
      base.db['words'].insert(data, function(err, inserted) {
        console.log(inserted);
        scope.count++;
        res.send("success");
      });
    });
  }

  scope.addToReviewList = function(req, res) {
    var t = new Date();
    var time = t.toLocaleString();
    //base.log(time, req.ip, 'POST Tango/AddToReviewList', req.header('host'), req.query, req.url);
    if (req.body.password != scope.password) {
      res.send('fail: wrong password');
      return;
    }
    req.body.password = undefined;
    base.db['words'].update({
      "id": parseInt(req.query.id)
    }, {
      $set: {
        added: "true",
        addtime: t,
        level: 0,
        review: 0
      }
    }, function(err, data) {
      if (err == null) {
        res.send('success');
      } else {
        res.send('fail');
      }
    });
  }

  scope.renderList = function(req, res, settings, type) {
    base.db['words'].find({}).sort({
      id: -1
      // level: 1
    }, function(err, words) {
      settings.words = words.map(function(d) {
        delete d['_id'];
        delete d['password'];
        delete d['yomikata'];
        delete d['tsukaikata'];
        delete d['imi'];
        delete d['akusento'];
        return d;
      });
      // console.log(JSON.stringify(settings.words).length);
      res.render(`tango/${type}`, settings); // type: list or wall
    });
    /*
    base.db.words.find({}, function(err, words) {
        settings.words = words;
        res.render('Tango-list', settings);
    });
    */
  }

  scope.renderWord = function(req, res, settings) {
    var id = req.query.id;

    base.db['words'].findOne({
      "id": parseInt(id)
    }, function(err, word) {
      //console.log(word);
      settings.count = scope.count;
      settings.word = word;
      res.render('Tango-word', settings);
    });
  }

  scope.generateSuperReview = function(req, res, settings, time_now, type) {
    var y = time_now.getFullYear();
    var m = time_now.getMonth() + 1;
    var d = time_now.getDate();
    var regex = new RegExp('^(.* )?' + type + '( .*)?$');
    base.db['words'].find({
      hinshi: {
        $regex: regex
      }
    }, function(err, words) {
      // console.log(words);
      settings.review = {
        y: y,
        m: m,
        d: d,
        t: req.query.time,
        words: words,
        tested: 0,
        correct: 0,
        finished: true,
        history: []
      };
      res.render('Tango-word-test', settings);
    });
  }

  scope.renderReviewHistory = function(req, res, settings, time_now) {
    var y = time_now.getFullYear();
    var m = time_now.getMonth() + 1;
    var d = time_now.getDate();
    if (req.query.type != undefined) {
      // 专题测试
      scope.generateSuperReview(req, res, settings, time_now, req.query.type);
      return;
    }
    if (req.query.time != undefined) {
      // 某天的测试
      // 偷懒写到同一个函数里
      var reqt = req.query.time;
      var reviews;
      if (reqt != 'today') {
        var t = new Date(parseInt(reqt));
        y = t.getFullYear();
        m = t.getMonth() + 1;
        d = t.getDate();
      }
      base.db['reviews'].findOne({
        "y": y,
        "m": m,
        "d": d
      }, function(err, result) {
        settings.review = result;
        res.render('Tango-word-test', settings);
      });
      return;
    }
    base.db['reviews'].find({
      "y": y,
      "m": m,
      "d": d
    }, function(err, result) {
      settings.no_today = false;
      if (!result.length) {
        settings.no_today = true;
      }
      base.db['reviews'].find({}, function(err, reviews) {
        settings.reviews = reviews;
        res.render('Tango-test', settings);
      });
    });
  }

  scope.clickGenerateReview = function(req, res, settings, time_now) {
    if (req.query.password != scope.password) {
      res.send('fail: wrong password');
      return;
    }
    var y = time_now.getFullYear();
    var m = time_now.getMonth() + 1;
    var d = time_now.getDate();

    base.db['reviews'].find({
      "y": y,
      "m": m,
      "d": d
    }, function(err, result) {
      if (!result.length) {
        scope.generateReview(req, res, function(words) {
          base.db['reviews'].insert({
            "y": y,
            "m": m,
            "d": d,
            "t": time_now.getTime(),
            "words": words,
            "tested": 0,
            "correct": 0,
            "finished": false,
            "history": [] // 每个元素形如{id: 233, result: "maamaa"}, 数组表示一系列测试的结果
          }, function(err, inserted) {
            // console.log(inserted);
            console.log("add test: ", words.length, "words");
            res.redirect('/Tango?page=test');
          });
        });
      } else {
        res.redirect('/Tango?page=test');
      }
    });

  }

  scope.generateReview = function(req, res, foo) {
    var words = [];
    base.db['words'].update({
      added: "true",
      review: {
        $gte: 1
      }
    }, {
      $inc: {
        review: -1
      }
    }, {
      multi: true
    }, function(err, data) {
      base.db['words'].find({
        added: "true",
        review: {
          $lte: 0
        }
      }, function(err, result) {
        foo(scope.randomSort(result));
      });
    });
  }

  scope.wordTestClicked = function(req, res) {
    if (req.body.password != scope.password) {
      res.send('fail: wrong password');
      return;
    }
    req.body.password = undefined;
    var t = new Date();
    var time = t.toLocaleString();
    //base.log(time, req.ip, 'POST WordTestClicked', req.header('host'), req.query, req.body.id + ' ' + req.body.result + ' ' + req.body.is_first);
    base.db['reviews'].findOne({
      "t": parseInt(req.query.time)
    }, function(err, review) {
      if (!review.finished) {
        var h = review.history;
        h.push(req.body);
        var tested = review.tested;
        var correct = review.correct;
        if (req.body.is_first == "true") {
          // console.log(typeof(req.body.is_first));
          tested++;
          if (req.body.result == 'maamaa') {
            correct++;
          }
        }
        base.db['reviews'].update({
          "t": parseInt(req.query.time)
        }, {
          $set: {
            "history": h,
            "tested": tested,
            "correct": correct
          }
        }, function(err, result) {
          // console.log(result);
          res.send('success');
        });
      } else {
        res.send('already finished');
      }
    });
  }

  scope.testFinished = function(req, res) {
    if (req.body.password != scope.password) {
      res.send('fail: wrong password');
      return;
    }
    req.body.password = undefined;
    var t = new Date();
    var time = t.toLocaleString();
    base.log(time, req.ip, 'POST TestFinished', req.header('host'), req.query);
    base.db['reviews'].update({
      "t": parseInt(req.query.time)
    }, {
      $set: {
        "finished": true
      }
    }, function(err, result) {
      scope.analyseResult(parseInt(req.query.time));
      res.send('success');
    });
  }

  scope.analyseResult = function(time) {
    base.db['reviews'].findOne({
      "t": time
    }, function(err, review) {
      var h = review.history;
      for (var i = 0; i < h.length; i++) {
        if (h[i].is_first == true || h[i].is_first == "true") {
          // console.log(i,h[i]);
          var result = h[i].result == "maamaa";
          scope.updateWordTestInfo(h[i].id, result, time);
        }
      }
    });
  }

  scope.updateWordTestInfo = function(id, result, time) {
    base.db['words'].findOne({
      "id": parseInt(id)
    }, function(err, word) {
      var word_history = word.history;
      var first_test = word_history.length == 0;
      var test_passed = result;
      var level = word.level;
      var review = word.review;

      level = test_passed ? (first_test ? 3 : level + 1) : (first_test ? 0 : level - 1);
      if (level < 0) level = 0;
      review = 1 << level;

      if (word_history == undefined) word_history = [];
      word_history.push({
        passed: test_passed,
        time: time,
        level: level
      });
      console.log(id, word.hiragana, 'level:', level, 'review:', review);
      base.db['words'].update({
        "id": parseInt(id)
      }, {
        $set: {
          "history": word_history,
          "level": level,
          "review": review
        }
      }, {
        upsert: true
      });
    });
  }

  scope.randomSort = function(a) {
    b = [];
    for (var i = 0; i < a.length; i++) {
      b.push(Math.random());
    }
    for (var i = a.length - 1; i > 0; i--) {
      for (var j = 0; j < i; j++) {
        if (b[j] > b[j + 1]) {
          var c = b[j];
          b[j] = b[j + 1];
          b[j + 1] = c;
          c = a[j];
          a[j] = a[j + 1];
          a[j + 1] = c;
        }
      }
    }
    return a;
  }
}

exports.func = new Tango();
