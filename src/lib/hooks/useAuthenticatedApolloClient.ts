import { useMemo } from 'react';
import { getIdToken } from '../storage/auth';
import {
    ApolloClient,
    ApolloClientOptions,
    InMemoryCache,
    NormalizedCacheObject,
} from '@apollo/client';
import { GRAPHQL_API_ENDPOINT } from '@env';

const getApolloClient = (idToken: string) => {
    const config: ApolloClientOptions<NormalizedCacheObject> = {
        uri: GRAPHQL_API_ENDPOINT,
        cache: new InMemoryCache(),
    };

    if (idToken) {
        config.headers = {
            'id-token': idToken,
        };
    }

    return new ApolloClient(config);
};

const getIdTokenWithDefault = async () => {
    const idToken = await getIdToken();
    if (idToken?.idToken) {
        return { idToken: idToken?.idToken };
    } else {
        return { idToken: '' };
    }
};

export const getAuthenticatedApolloClient = async () => {
    const { idToken } = await getIdTokenWithDefault();
    return getApolloClient(idToken);
};

const useAuthenticatedApolloClient = (idToken: string | null) => {
    const client = useMemo(() => {
        return getApolloClient(idToken ?? '');
    }, [idToken]);

    return client;
};

export default useAuthenticatedApolloClient;
