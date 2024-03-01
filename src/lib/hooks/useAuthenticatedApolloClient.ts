import { useMemo, useState } from 'react';
import { getClientKey } from '../storage/auth';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { useAsyncIntervalValue } from './useInterval';

const getApolloClient = (id: string, secret: string) => {
    if (!id || !secret) return new ApolloClient({ cache: new InMemoryCache() });
    return new ApolloClient({
        headers: {
            'Client-Id': id,
            'Client-Secret': secret,
        },
        cache: new InMemoryCache(),
    });
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
        validAuthValue ? 1000 * 60 : 1000, // TODO: Slow this down
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
