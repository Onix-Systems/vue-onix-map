import {DirectiveOptions} from 'vue';


const clickOutside: DirectiveOptions = {
  bind(el: any, binding: any, vnode: any) {
    el.clickOutsideEvent = (event: MouseEvent) => {
      if (!(el === event.target || el.contains(event.target))) {
        vnode.context[binding.expression](event);
      }
    };
    setTimeout(() => {
      document.body.addEventListener('click', el.clickOutsideEvent);
    });
  },
  unbind(el: any) {
    document.body.removeEventListener('click', el.clickOutsideEvent);
  },
};

export default clickOutside;
