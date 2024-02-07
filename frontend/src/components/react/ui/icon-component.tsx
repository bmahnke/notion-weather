import { lazy, Suspense } from 'react';

interface IconComponentProps {
    icon: string,
    alt?: string,
    className?: string
}

export function IconComponent(props: IconComponentProps) {
    return (
        <div className={props.className}>
            <Suspense fallback={<div>...</div>}>
                <img 
                    alt={props.alt}
                    src={`/svg/${props.icon}.svg`}
                />
            </Suspense>
        </div>
    )
}