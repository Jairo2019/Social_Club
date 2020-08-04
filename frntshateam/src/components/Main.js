import React from 'react'

export default function Main({children, center}) {
    let mainCss = `Main ${center ? 'Main--center' : ''}`;

    return <main className={mainCss}>{children}</main>
}