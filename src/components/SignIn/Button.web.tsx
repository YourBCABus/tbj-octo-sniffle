import React, { FC, useContext, useEffect } from 'react';
import GoogleLogo from './google-logo.svg';
import { ButtonProps } from './Button.d';
import type { User } from '@react-native-google-signin/google-signin';
import { CanBypassFrontendDomainRestrictionsContext } from '../../../App';
import { alert } from '../../lib/webcompat/alerts';

const Button: FC<ButtonProps> = ({ onSuccess, onError }) => {
    const [bypass] = useContext(CanBypassFrontendDomainRestrictionsContext);
    useEffect(() => {
        // @ts-expect-error
        window.canBypassDomainRestrictions = bypass;
        // @ts-expect-error
        window.onLoginCallback = function (value) {
            try {
                const { credential } = value;
                const [, body] = credential.split('.');
                // @ts-expect-error
                const json = window.atob(body);
                const userData = JSON.parse(json);
                const user: User = {
                    user: {
                        id: userData.sub,
                        name: userData.name,
                        email: userData.email,
                        photo: userData.picture,
                        familyName: userData.family_name,
                        givenName: userData.given_name,
                    },
                    idToken: credential,
                    scopes: [],
                    serverAuthCode: null,
                };
                // @ts-expect-error
                const canBypass = window.canBypassDomainRestrictions;
                if (canBypass || user.user.email.match(/^.+@bergen\.org$/)) {
                    onSuccess(user);
                } else {
                    alert('Please sign in with an @bergen.org email address');
                    onError();
                }
            } catch (e) {
                onError();
            }
        };

        return () => {
            // @ts-expect-error
            delete window.onLoginCallback;
            // @ts-expect-error
            delete window.canBypassDomainRestrictions;
        };
    }, [onSuccess, onError, bypass]);
    useEffect(() => {
        const GSI_CLIENT_URL = 'https://accounts.google.com/gsi/client';
        // @ts-expect-error
        const document: any = window.document;
        const s = document.createElement('script');
        s.src = GSI_CLIENT_URL;
        document.head.appendChild(s);

        let frameHandle = 0;
        function replaceSvg() {
            const svgContainer = document.querySelector(
                '#google_sign_in_button > div > div > div > div:not(:empty) > div',
            );
            if (!svgContainer) {
                frameHandle = requestAnimationFrame(replaceSvg);
                return;
            }
            svgContainer.innerHTML = `
                <svg width="24" height="24">
                    <image width="24" height="24" href="${GoogleLogo}">
                </svg>
            `;
        }
        frameHandle = requestAnimationFrame(replaceSvg);

        return () => {
            // @ts-expect-error
            delete window.onLoginCallback;
            cancelAnimationFrame(frameHandle);
            document.head.removeChild(s);
        };
    }, []);
    return (
        <>
            <div
                id="g_id_onload"
                data-client_id="272982920556-82qhftjei4mhs0sm5g91dutu655tkdd0.apps.googleusercontent.com"
                data-context="signin"
                data-ux_mode="popup"
                data-callback="onLoginCallback"
                data-auto_prompt="false"
            />

            <div
                id="google_sign_in_button"
                className="g_id_signin"
                data-type="standard"
                data-shape="rectangular"
                data-theme="filled_black"
                data-text="signin_with"
                data-size="large"
                data-logo_alignment="left"
            />
        </>
    );
};

export default Button;
