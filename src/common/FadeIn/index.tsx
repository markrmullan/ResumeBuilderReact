import React, { Children, PureComponent, ReactElement, cloneElement } from 'react';

import classnames from 'classnames';
import { InView } from 'react-intersection-observer';

import styles from './styles.module.scss';

type TComponentProps = {
  threshold?: number;
};

/**
 * The `className` propped based to the children handles the animation
 *
 * Usage:
 *
 * <FadeIn>
 *   {({ className, ref } : { className: string, ref: React.Ref<HTMLElement> }) => (
 *     <ChildComponent className={classnames(className, ...rest)} ref={ref}>
 *     </ChildComponent>
 *   )}
 * </FadeIn>
 */
class FadeInComponent extends PureComponent<TComponentProps> {
  public render() {
    const { children: child, threshold = 0.3 } = this.props;

    return (
      <InView triggerOnce threshold={threshold}>
        {({ inView, ref }) => {
          const className = classnames(styles.hidden, { [styles.inView]: inView });
          const props = { inView, ref, className };

          if (typeof child === 'function') {
            const children = child(props);

            return cloneElement(children);
          }

          return cloneElement(Children.only(child as ReactElement), props);
        }}
      </InView>
    );
  }
}

export const FadeIn = FadeInComponent;
