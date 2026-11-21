'use client';

import { ComponentProps } from 'react';
import styles from './forbidden.module.css';
import Link from 'next/link';

export default function ForbiddenPage() {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <ForbiddenIllustration className={styles.illustration} />

                <h1 className={styles.title}>403 - Access Forbidden</h1>

                <p className={styles.description}>
                    You don&apos;t have permission to access this resource.
                    Please contact your administrator if you believe this is an error.
                </p>

                <div className={styles.buttonGroup}>
                    <button
                        onClick={() => window.history.back()}
                        className={styles.primaryButton}
                    >
                        Go Back
                    </button>

                    <Link href="/" className={styles.secondaryButton}>
                        Return Home
                    </Link>
                </div>
            </div>
        </div>
    );
}

function ForbiddenIllustration({ className }: { className?: string }) {
    return (
        <svg
            width="200"
            height="200"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <circle cx="100" cy="100" r="90" fill="#F0F0FF" />
            <path
                d="M100 50C72.3858 50 50 72.3858 50 100C50 127.614 72.3858 150 100 150C127.614 150 150 127.614 150 100C150 72.3858 127.614 50 100 50ZM80 125L75 120L95 100L75 80L80 75L100 95L120 75L125 80L105 100L125 120L120 125L100 105L80 125Z"
                fill="#4945FF"
            />
        </svg>
    );
}