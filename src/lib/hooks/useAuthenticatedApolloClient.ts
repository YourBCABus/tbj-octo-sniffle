import { useMemo, useState } from 'react';
import { getClientKey } from '../storage/auth';
import {
    ApolloClient,
    ApolloClientOptions,
    InMemoryCache,
    NormalizedCacheObject,
} from '@apollo/client';
import { useAsyncIntervalValue } from './useInterval';
import { GRAPHQL_API_ENDPOINT } from '@env';

const getApolloClient = (id: string, secret: string) => {
    const config: ApolloClientOptions<NormalizedCacheObject> = {
        uri: GRAPHQL_API_ENDPOINT,
        cache: new InMemoryCache(),
    };

    if (id && secret) {
        config.headers = {
            'Client-Id': id,
            'Client-Secret': secret,
        };
    }

    return new ApolloClient(config);
};

const getKeyWithDefault = async () => {
    const key = await getClientKey();
    if (!key) return { id: '', secret: '' };
    return key;
};

export const getAuthenticatedApolloClient = async () => {
    const { id, secret } = await getKeyWithDefault();
    return getApolloClient(id, secret);
};

const useAuthenticatedApolloClient = () => {
    const [validAuthValue, setValidAuthValue] = useState(false);
    const { id, secret } = useAsyncIntervalValue(
        getKeyWithDefault,
        validAuthValue ? 60 * 1000 * 60 : 10 * 1000, // TODO: Slow this down
        { id: '', secret: '' },
    );

    const client = useMemo(() => {
        if (id && secret) setValidAuthValue(true);
        else setValidAuthValue(false);
        return getApolloClient(id, secret);
    }, [id, secret]);

    return client;
};

export default useAuthenticatedApolloClient;
