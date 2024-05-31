import React, { useCallback, useMemo } from 'react';

import { View, Text } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';

import { AbsenceState, Period, Teacher } from '../../lib/types/types';
import { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import TeacherStatusSubtitle from '../TeacherEntry/TeacherStatusSubtitle';

type BackdropProps = JSX.IntrinsicAttributes & BottomSheetDefaultBackdropProps;

interface TeacherBottomModalProps {
    modalRef?: React.Ref<BottomSheetModalMethods>;

    teacher: Teacher;
    status: AbsenceState;
    periods: Period[];

    starred: boolean;
    toggleStar: () => void;
}

function CommentsBody({ comments }: { comments: string }) {
    return (
        <View className="flex flex-col items-center mt-5">
            <Text className="text-lg text-slate-400">Teacher Comments:</Text>
            <Text className="text-white">{comments}</Text>
        </View>
    );
}

export default function TeacherBottomModal(props: TeacherBottomModalProps) {
    const snapPoints = useMemo(() => ['45%'], []);

    const renderBackdrop = useCallback(
        (backdropProps: BackdropProps) => (
            <BottomSheetBackdrop
                {...backdropProps}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
            />
        ),
        [],
    );

    const name = props.teacher.displayName;

    return (
        <BottomSheetModal
            ref={props.modalRef}
            index={0}
            snapPoints={snapPoints}
            backgroundStyle={{ backgroundColor: 'rgb(9 9 11)' }}
            handleIndicatorStyle={{ backgroundColor: 'white' }}
            enableOverDrag={true}
            backdropComponent={renderBackdrop}>
            <View className="flex flex-col h-full items-center bg-zinc-950 align-middle">
                <View className="flex flex-row mt-2">
                    <Text className="text-[#9898f5] text-center w-full text-xl">
                        {name}
                    </Text>
                </View>
                <TeacherStatusSubtitle
                    status={props.status}
                    periods={props.periods}
                    teacher={props.teacher}
                    alwaysShow={true}
                />

                {props.teacher.comments && (
                    <CommentsBody comments={props.teacher.comments} />
                )}
                {/* <Text className="text-white">{props.teacher.comments}</Text> */}
                {/* { renderModalBody(props) } */}
            </View>
        </BottomSheetModal>
    );
}
