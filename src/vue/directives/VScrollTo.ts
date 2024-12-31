import { Directive, DirectiveBinding } from 'vue';

function scrollTo(element: HTMLElement, binding: DirectiveBinding<boolean, string, string>) {
  let parent = element.parentElement;

  for (let i = 0; i < 3; i++) {
    if (!parent) break;

    const hasScroll = parent.scrollHeight > parent.clientHeight || parent.scrollWidth > parent.clientWidth;
    if (hasScroll) {
      break;
    }
    parent = parent.parentElement;
  }
  if (!parent) return;

  const elementRect = element.getBoundingClientRect();
  const parentRect = parent.getBoundingClientRect();

  const scrollOptions: ScrollToOptions = {
    behavior: binding.modifiers.smooth ? 'smooth' : 'auto'
  }; 
  
  if (binding.modifiers.vertical || !binding.modifiers.horizontal) {
    scrollOptions.top = elementRect.top - parentRect.top + parent.scrollTop
      - (parentRect.height / 2) + (elementRect.height / 2);
  }

  if (binding.modifiers.horizontal || !binding.modifiers.vertical) {
    scrollOptions.left = elementRect.left - parentRect.left + parent.scrollLeft
      - (parentRect.width / 2) + (elementRect.width / 2);
  }

  parent.scrollTo(scrollOptions);
}

export default <Directive<HTMLElement, boolean, string, string>>{
  updated: (element, binding) => {
    if (!binding.modifiers.updated || !binding.value) return;
    scrollTo(element, binding);
  },
  mounted: (element, binding) => {
    if (!binding.modifiers.mounted || !binding.value) return;
    scrollTo(element, binding);
  }
};