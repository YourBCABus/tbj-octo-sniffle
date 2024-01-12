import { useCallback, useState } from 'react';
import {
    ApolloQueryResult,
    DocumentNode,
    OperationVariables,
    QueryHookOptions,
    QueryResult,
    TypedDocumentNode,
    useQuery,
} from '@apollo/client';

interface RefreshableQueryResult<T, V extends OperationVariables>
    extends Omit<QueryResult<T, V>, 'refetch'> {
    refresh: () => Promise<ApolloQueryResult<T>>;
    refreshing: boolean;
}

const useRefreshableQuery = <Q, V extends OperationVariables>(
    query: DocumentNode | TypedDocumentNode<Q, V>,
    options?: QueryHookOptions<Q, V>,
): RefreshableQueryResult<Q, V> => {
    const [isRefreshing, setIsRefreshing] = useState(false);

    const { refetch, ...queryReturn } = useQuery(query, options);

    const refresh = useCallback(() => {
        setIsRefreshing(true);
        return refetch()
            .then(v => {
                setIsRefreshing(false);
                return v;
            })
            .catch(e => {
                setIsRefreshing(false);
                console.log('refetch failed:', e);
                return e;
            });
    }, [refetch, setIsRefreshing]);

    return {
        ...queryReturn,
        refresh,
        refreshing: isRefreshing,
    };
};

export default useRefreshableQuery;
