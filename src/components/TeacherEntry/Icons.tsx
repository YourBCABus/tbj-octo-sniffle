import React from 'react';

import Icon from 'react-native-vector-icons/Ionicons';
import { Pressable, View } from 'react-native';

import { ColorInput, colorToString } from '../../lib/utils';

interface StarProps {
    disableInteraction: boolean;
    starred: boolean;
    toggle: () => void;
}

const STAR_SIZE = 30;

export function Star({ disableInteraction, toggle, starred }: StarProps) {
    let starIcon: React.ReactElement;
    if (starred) {
        starIcon = <Icon name="star" size={STAR_SIZE} color="#9898f5" />;
    } else {
        starIcon = (
            <Icon name="star-outline" size={STAR_SIZE} color="#9898f5" />
        );
    }

    if (disableInteraction) {
        return starIcon;
    } else {
        return (
            <Pressable onPress={toggle} hitSlop={2} className="my-auto">
                {starIcon}
            </Pressable>
        );
    }
}

interface SimpleIconProps {
    icon: string;
    hide?: boolean;
    color?: ColorInput;
    collapseOnHide?: boolean;
    onClick?: () => void;
    size?: number;
    className?: string;
}

export function SimpleIcon({
    icon,
    hide,
    color,
    collapseOnHide,
    onClick,
    size,
    className,
}: SimpleIconProps) {
    if (hide && collapseOnHide) {
        return null;
    }

    const iconElement = (
        <Icon
            name={icon}
            size={size ?? 21}
            color={hide ? 'rgba(0 0 0 0)' : colorToString(color || '#4a5989')}
        />
    );

    if (onClick) {
        return (
            <Pressable onPress={onClick} hitSlop={2} className={className ?? 'my-auto'}>
                {iconElement}
            </Pressable>
        );
    } else {
        return (
            // <View className={className ?? 'my-auto'}>
            <View className={className ?? 'my-auto'}>
                {iconElement}
            </View>
        );
    }
}

interface PremadeIconProps {
    hide?: boolean;
    collapseOnHide?: boolean;
}

export function OpenChevron({ hide, collapseOnHide }: PremadeIconProps) {
    return (
        <SimpleIcon
            icon="chevron-forward-outline"
            hide={hide}
            collapseOnHide={collapseOnHide}
            color="#797881"
        />
    );
}

export function HasComments({ hide, collapseOnHide }: PremadeIconProps) {
    return (
        <SimpleIcon
            icon="chatbox"
            hide={hide}
            collapseOnHide={collapseOnHide}
            size={26}
            className='mr-10'
        />
    );
}

interface RightIconBarProps {
    hasComments: boolean;
    starred: boolean;
    toggleStar: () => void;
    disableInteraction: boolean;
}

export function RightIconBar({
    hasComments,
    starred,
    toggleStar,
    disableInteraction,
}: RightIconBarProps) {
    return (
        <View className="flex flex-row items-center">
            <HasComments hide={!hasComments} collapseOnHide />
            <Star
                starred={starred}
                toggle={toggleStar}
                disableInteraction={disableInteraction}
            />
            <OpenChevron />
            {/* <View className="my-auto">
            <Icon
                name="chevron-forward-outline"
                size={21}
                color="rgb(121 120 129)"
            />
        </View> */}
        </View>
    );
}
