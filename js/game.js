var Game = function($box, controls, displays){
  var self = this;
  self.$box = $box;
  self.controls = controls;
  self.displays = displays;
  self.paused = false;
  self.isGameOver = false;
  self.score = 0;
  self.blockCount = 0;
  self.board;
  self.engine;

  self.addPoints = function(points){
    self.score += points;
    self.displays.score.html(self.score.toString());
  };

  self.incrementBlockCount = function(){
    self.blockCount++;
    self.displays.blockCount.html(self.blockCount.toString());
  };

  function start(){
    self.isGameOver = false;
    self.paused = false;
    self.$box.empty();
    self.score = 0;
    self.blockCount = 0;
    self.displays.score.html('0');
    self.displays.blockCount.html('0');
    self.board = new Board(self, self.$box, 20, 10);
    self.engine = new Engine(self.board, self);
    self.engine.start();
    if ($(window).width() < 1024) {
        $('#intro').hide();
    }
  }

  function pause(){
    if(!self.isGameOver) {
      if (self.paused) {
        self.$box.find('div.paused').remove();
        if ($(window).width() > 1024) {
          self.$box.find('div.paused').remove();
        } else {
          $('#intro').hide();
          $('.wrapper').find('div.paused').remove();
        }
        self.controls.pause.text('Pause Game');
        self.engine.resume();
        self.paused = false;
      } else {
        if ($(window).width() > 1024){
          self.$box.append($('<div/>').addClass('paused'))
        } else {
          $('#intro').show();
          $('.wrapper').append($('<div/>').addClass('paused'));
        }
        self.controls.pause.text('Resume Game');
        self.engine.pause();
        self.paused = true;
      }
    }
  }

  self.gameOver = function(){
    pause();
    self.$box.find('.paused').html(ui.gameOver(self.score, "1:45", self.blockCount));
    self.isGameOver = true;
    //self.$box.html(ui.gameOver(self.score, "1:45", self.blockCount));
  };

  controls.new.click(start);
  controls.pause.click(pause);
  $(window).dblclick(pause);

  $(document).on('keydown', function(e){
    if(self.board.block == null) return;
    switch(e.which){
      case controls.left:
        self.board.block.moveLeft(self.board);
        break;
      case controls.right:
        self.board.block.moveRight(self.board);
        break;
      case controls.down:
        self.board.block.moveDown(self.board);
        break;
      case controls.rotate:
        self.board.block.rotateRight(self.board);
        break;
    }
  });
};