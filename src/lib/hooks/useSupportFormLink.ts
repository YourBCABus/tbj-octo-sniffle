import { GET_SUPPORT_FORM } from '../graphql/Queries';
import useRefreshableQuery from './useRefreshableQuery';
import useRerender from './useRerender';

const useSupportFormLink = (): string | undefined => {
    const rerender = useRerender();

    const { data } = useRefreshableQuery<
        { attribs: { supportFormUrl?: string } },
        {}
    >(GET_SUPPORT_FORM, {
        pollInterval: 30000,
        onError: e => console.log(e),
        onCompleted: () => setTimeout(() => rerender(), 10),
    });

    return data?.attribs.supportFormUrl;
};

export default useSupportFormLink;
