(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['react'], factory);
  } else if (typeof exports !== 'undefined') {
    module.exports = factory(require('react'));
  } else {
    root.OlayReact = factory(root.React);
  }
})(this, function (React) {
  'use strict';

  var DOM = React.DOM;

  var CSSTransitionGroup = React.addons.CSSTransitionGroup;

  document.addEventListener('keydown', function (ev) {
    if (!active.length) return;
    var last = active[active.length - 1];
    var keys = last.props.closeOnKeys || [];
    var which = ev.which;
    for (var i = 0, l = keys.length; i < l; ++i) {
      if (which !== keys[i]) continue;
      last.props.close();
      return false;
    }
  });

  var active = [];

  var activate = function (component) {
    if (active.indexOf(component) !== -1) return;
    active.push(component);
    document.body.classList.add('olay-active');
  };

  var deactivate = function (component) {
    var i = active.indexOf(component);
    if (i === -1) return;
    active.splice(i, 1);
    if (!active.length) document.body.classList.remove('olay-active');
  };

  return React.createClass({
    propTypes: {
      close: React.PropTypes.func.isRequired
    },

    getDefaultProps: function () {
      return {
        transitionName: 'olay-fade',
        closeOnKeys: [27],
        closeOnClick: true
      };
    },

    componentWillUnmount: function () {
      deactivate(this);
    },

    componentDidMount: function () {
      this.setActive();
    },

    componentDidUpdate: function () {
      this.setActive();
    },

    setActive: function () {
      this.props.children ? activate(this) : deactivate(this);
    },

    handleClick: function (ev) {
      if (!this.props.closeOnClick) return;
      var target = ev.target;
      var content = this.refs.content.getDOMNode();
      if (!content.contains(target)) this.props.close();
    },

    renderChild: function (child) {

      // INFO: Returning [] is necessary until React > 0.10.0.
      if (!child) return [];

      return (
        DOM.div({className: 'olay-container', onClick: this.handleClick},
          DOM.div({className: 'olay-table'},
            DOM.div({className: 'olay-cell'},
              DOM.div({ref: 'content',className: 'olay-content'},
                child
              )
            )
          )
        )
      );
    },

    render: function () {
      return this.transferPropsTo(
        CSSTransitionGroup({
          component: DOM.div,
          transitionName: this.props.transitionName,
          transitionEnter: this.props.transitionEnter,
          transitionLeave: this.props.transitionLeave
        }, this.renderChild(this.props.children))
      );
    }
  });
});
