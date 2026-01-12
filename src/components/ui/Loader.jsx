import React from "react";

export default function Loader({ className = "" }) {
    return (
        <div
            aria-label="Loading"
            role="status"
            className={`loader ${className}`.trim()}
        />
    );
}
