import React, {cloneElement, forwardRef} from 'react';

/**
 * Safely merge a child's ref with a provided ref.
 * @param {any} childRef - The ref from the child element.
 * @param {any} node - The DOM node.
 */
function mergeRef(childRef, node) {
  if (typeof childRef === 'function') {
    childRef(node);
  } else if (childRef != null) {
    childRef.current = node;
  }
}

export default (Tippy, defaultProps) =>
  forwardRef(function TippyWrapper({children, ...props}, ref) {
    return (
      // If I spread them separately here, Babel adds the _extends ponyfill for some reason.
      <Tippy {...{...defaultProps, ...props}}>
        {children
          ? cloneElement(children, {
              ref(node) {
                // Use the forwarded ref:
                if (ref) {
                  if (typeof ref === 'function') {
                    ref(node);
                  } else {
                    ref.current = node;
                  }
                }
                // Merge the child's ref, if any, using mergeRef:
                if (
                  children &&
                  typeof children === 'object' &&
                  'ref' in children
                ) {
                  mergeRef(children.ref, node);
                }
              },
            })
          : null}
      </Tippy>
    );
  });
