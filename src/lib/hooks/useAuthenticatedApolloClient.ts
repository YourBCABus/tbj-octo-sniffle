import { useMemo, useState } from 'react';
import { getServerAuthCode } from '../storage/auth';
import {
    ApolloClient,
    ApolloClientOptions,
    InMemoryCache,
    NormalizedCacheObject,
} from '@apollo/client';
import { useAsyncIntervalValue } from './useInterval';
import { GRAPHQL_API_ENDPOINT } from '@env';

const getApolloClient = (serverAuthCode: string) => {
    const config: ApolloClientOptions<NormalizedCacheObject> = {
        uri: GRAPHQL_API_ENDPOINT,
        cache: new InMemoryCache(),
    };

    if (serverAuthCode) {
        config.headers = {
            'Server-Auth-Code': serverAuthCode,
        };
    }

    return new ApolloClient(config);
};

const getServerAuthCodeWithDefault = async () => {
    const code = await getServerAuthCode();
    if (code?.serverAuthCode) {
        return { serverAuthCode: code?.serverAuthCode };
    } else {
        return { serverAuthCode: '' };
    }
};

export const getAuthenticatedApolloClient = async () => {
    const { serverAuthCode } = await getServerAuthCodeWithDefault();
    return getApolloClient(serverAuthCode);
};

const useAuthenticatedApolloClient = () => {
    const [validAuthValue, setValidAuthValue] = useState(false);
    const { serverAuthCode } = useAsyncIntervalValue(
        getServerAuthCodeWithDefault,
        validAuthValue ? 60 * 1000 * 60 : 10 * 1000, // TODO: Slow this down
        { serverAuthCode: '' },
    );

    const client = useMemo(() => {
        setValidAuthValue(!!serverAuthCode);
        return getApolloClient(serverAuthCode);
    }, [serverAuthCode]);

    return client;
};

export default useAuthenticatedApolloClient;
