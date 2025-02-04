import React from 'react';

import { Platform, ScrollView } from 'react-native';
import { ScrollViewContainer as IOSScrollViewContainer } from 'react-native-reorderable-list';

const ScrollViewContainer: typeof IOSScrollViewContainer = props => {
    if (Platform.OS === 'ios') {
        return <IOSScrollViewContainer {...props} />;
    } else {
        return <ScrollView {...props} />;
    }
};

export default ScrollViewContainer;
