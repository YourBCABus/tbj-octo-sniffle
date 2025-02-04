import React from 'react';

import { Platform } from 'react-native';
import { NestedReorderableList as IOSNestedReorderableList } from 'react-native-reorderable-list';

const NestedReorderableList: typeof IOSNestedReorderableList = props => {
    if (Platform.OS === 'ios') {
        return <IOSNestedReorderableList {...props} />;
    } else {
        return (
            <>
                {props.data.map((item, index) =>
                    props.renderItem?.({
                        item,
                        index,
                        separators: {
                            highlight: () => {},
                            unhighlight: () => {},
                            updateProps: () => {},
                        },
                    }),
                )}
            </>
        );
    }
};

export default NestedReorderableList;
