var injected = injected || (function() {

  // Inspector constructor

  var Inspector = function() {
    // this.highlight = this.highlight.bind(this);
    this.log = this.log.bind(this);
    // this.codeOutput = this.codeOutput.bind(this);
    this.layout = this.layout.bind(this);
    this.handleResize = this.handleResize.bind(this);

    this.$target = document.body;
    this.$cacheEl = document.body;
    this.$cacheElMain = document.body;

    this.serializer = new XMLSerializer();
    this.forbidden = [this.$cacheEl, document.body, document.documentElement];
  };

  Inspector.prototype = {

    getNodes: function() {
      var path = chrome.extension.getURL("template.html");

      var xmlhttp = new XMLHttpRequest();

      xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
          this.template = xmlhttp.responseText;
          this.createNodes();
          this.registerEvents();
        }
      }.bind(this);

      xmlhttp.open("GET", path, true);
      xmlhttp.send();
    },

    createNodes: function() {

      this.$host = document.createElement('div');
      this.$host.className = 'tl-host';
      this.$host.style.cssText = 'all: initial;';


      var shadow = this.$host.createShadowRoot();
      document.body.appendChild(this.$host);

      var templateMarkup = document.createElement("div");
      templateMarkup.innerHTML = this.template;
      shadow.innerHTML = templateMarkup.querySelector('template').innerHTML;

      this.$wrap = shadow.querySelector('.tl-wrap');
      // this.$code = shadow.querySelector('.tl-code');

      this.$canvas = shadow.querySelector('#tl-canvas');
      this.ctx = this.$canvas.getContext('2d');
      this.width = this.$canvas.width = window.innerWidth;
      this.height = this.$canvas.height = window.innerHeight;

      // this.highlight();
    },

    registerEvents: function() {
      document.addEventListener('mousemove', this.log);
      document.addEventListener('scroll', this.layout);
      document.addEventListener('click', this.handleClick);
      window.addEventListener('resize', function(){
        this.handleResize();
        this.layout();
      }.bind(this));
    },

    log: function(e) {
      this.$target = e.target;

      // check if element cached
      if (this.forbidden.indexOf(this.$target) !== -1) return;

      this.stringified = this.serializer.serializeToString(this.$target);

      this.$cacheEl = this.$target;
      this.layout();

    },

    // codeOutput: function() {
    //   if (this.$cacheElMain === this.$target) return;
    //   this.$cacheElMain = this.$target;

    //   var fullCode = this.stringified
    //     .slice(0, this.stringified.indexOf('>') + 1)
    //     .replace(/ xmlns="[^"]*"/, '');

    //   this.$code.innerText = fullCode; // set full element code
    //   // this.highlight(); // highlight element


    // },
    handleClick: function(e) {
      // console.log('localStorage:', localStorage)
      var currnetDOM = e.target
      var config = {
        // allowTaint: true,
        useCORS: true
      }
      // html2canvas(currnetDOM, config).then((canvas) => {
      // html2canvas(currnetDOM).then((canvas) => {
      html2canvas(currnetDOM, config).then((canvas) => {
        var canvasImg = canvas.toDataURL();
        // localStorage.removeItem('bazierImgUrl');
        debugger
        localStorage.setItem('bazierImgUrl', canvasImg);
        chrome.runtime.sendMessage(canvasImg, function(response) {
          console.log(response)
        })
        // document.body.appendChild(canvas)
      })
    },
    // redraw overlay
    layout: function() {
      var box, computedStyle, rect;
      var ctx = this.ctx;

      rect = this.$target.getBoundingClientRect();
      computedStyle = window.getComputedStyle(this.$target);
      box = {
        width: rect.width,
        height: rect.height,
        top: rect.top,
        left: rect.left,
        margin: {
          top: computedStyle.marginTop,
          right: computedStyle.marginRight,
          bottom: computedStyle.marginBottom,
          left: computedStyle.marginLeft
        },
        padding: {
          top: computedStyle.paddingTop,
          right: computedStyle.paddingRight,
          bottom: computedStyle.paddingBottom,
          left: computedStyle.paddingLeft
        }
      };
     
      // pluck negatives
      ['margin', 'padding'].forEach(function(property) {
        for (var el in box[property]) {
          var val = parseInt(box[property][el], 10);
          box[property][el] = Math.max(0, val);
        }
      });
      // console.log('DOM_node:', this.$target)
      ctx.clearRect(0, 0, this.width, this.height);

      box.left = Math.floor(box.left) + 1.5;
      box.width = Math.floor(box.width) - 1;

      var x, y, width, height;

      // margin
      x = box.left - box.margin.left;
      y = box.top - box.margin.top;
      width = box.width + box.margin.left + box.margin.right;
      height = box.height + box.margin.top + box.margin.bottom;

      ctx.fillStyle = 'rgba(255,165,0,0.5)'; //透明黄色
      ctx.fillRect(x, y, width, height);

      // padding
      x = box.left;
      y = box.top;
      width = box.width;
      height = box.height;

      ctx.fillStyle = 'rgba(158,113,221,0.5)'; //透明紫色
      ctx.clearRect(x, y, width, height);
      ctx.fillRect(x, y, width, height);

      // content
      x = box.left + box.padding.left;
      y = box.top + box.padding.top;
      width = box.width - box.padding.right - box.padding.left;
      height = box.height - box.padding.bottom - box.padding.top;

      ctx.fillStyle = 'rgba(73,187,231,0.25)'; //透明浅蓝色
      ctx.clearRect(x, y, width, height);
      ctx.fillRect(x, y, width, height);

      // rulers (horizontal - =)
      x = -10;
      y = Math.floor(box.top) + 0.5;
      width = this.width + 10;
      height = box.height - 1;

      ctx.beginPath();
      ctx.setLineDash([10,3]);
      ctx.fillStyle = 'rgba(0,0,0,0.02)';
      ctx.strokeStyle = 'rgba(13, 139, 201, 0.45)'; //透明深蓝色
      ctx.lineWidth = 1;
      ctx.rect(x, y, width, height);
      ctx.stroke();
      ctx.fill();

      // rulers (vertical - ||)
      x = box.left;
      y = -10;
      width = box.width;
      height = this.height + 10;

      ctx.beginPath();
      ctx.setLineDash([10,3]);
      ctx.fillStyle = 'rgba(0,0,0,0.02)';
      ctx.strokeStyle = 'rgba(13, 139, 201, 0.45)';//透明深蓝色
      ctx.lineWidth = 1;
      ctx.rect(x, y, width, height);
      ctx.stroke();
      ctx.fill();
    },

    handleResize: function() {
      this.width = this.$canvas.width = window.innerWidth;
      this.height = this.$canvas.height = window.innerHeight;
    },

    // code highlighting
    // highlight: function() {
    //   Prism.highlightElement(this.$code);
    // },

    activate: function() {
      this.getNodes();
    },

    deactivate: function() {
      this.$wrap.classList.add('-out');
      document.removeEventListener('mousemove', this.log);
      document.removeEventListener('click', this.handleClick);
      setTimeout(function() {
        document.body.removeChild(this.$host);
      }.bind(this), 600);
    }
  };

  var hi = new Inspector();

  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'activate') {
      return hi.activate();
    } else {
      return hi.deactivate();
    }
  });

  return true;
})();
