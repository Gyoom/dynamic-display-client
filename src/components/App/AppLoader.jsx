import App from "./App"
import { ProviderWrapper as ConfigProviderWrapper } from "contexts/configContext"

const AppLoader = () => {
    return (
        <ConfigProviderWrapper>
            <App />
        </ConfigProviderWrapper>
    )
}

export default AppLoader