import Html from "./Html"
import Text from "./Text"
export default function HtmlTree({ htmlId, config, className }) {
    const value = config.html_elements[htmlId]

    return (
        <div className={className}>
            {value.type === "Element" ?
                <Html value={value} config={config} />
                :
                value.type === "Expression" ?
                    "Expression"
                    :
                    <Text value={value}  />
            }
        </div>
    )
}