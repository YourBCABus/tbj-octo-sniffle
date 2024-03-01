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
import useAuthenticatedApolloClient from './useAuthenticatedApolloClient';

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

    const client = useAuthenticatedApolloClient();
    const { refetch, ...queryReturn } = useQuery(query, { ...options, client });

    const refresh = useCallback(async () => {
        setIsRefreshing(true);
        try {
            const val = await refetch();
            setIsRefreshing(false);
            return val;
        } catch (e) {
            setIsRefreshing(false);
            console.log('refetch failed:', e);
            return e as any;
        }
    }, [refetch, setIsRefreshing]);

    return {
        ...queryReturn,
        refresh,
        refreshing: isRefreshing,
    };
};

export default useRefreshableQuery;
