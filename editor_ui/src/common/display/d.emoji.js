import React from "react"

const Emoji = React.memo(({ className, label, symbol, style }) =>
    <span className={className} style={style} role="img" aria-label={label}>
        {String.fromCodePoint(symbol)}
    </span>)

export default Emoji