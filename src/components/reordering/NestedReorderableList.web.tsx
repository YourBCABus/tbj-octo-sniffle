import React from 'react';
import type { NestedReorderableList as IOSNestedReorderableList } from 'react-native-reorderable-list';

const NestedReorderableList: typeof IOSNestedReorderableList = props => (
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

export default NestedReorderableList;
