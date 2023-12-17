import App from "./App"
import { ProviderWrapper as ConfigProviderWrapper } from "contexts/configContext"
import { ProviderWrapper as SeriesProviderWrapper } from "contexts/seriesContext"
import { ProviderWrapper as SlidesProviderWrapper } from "contexts/slidesContext"

const AppLoader = () => {
    return (
        <SlidesProviderWrapper>
            <SeriesProviderWrapper>
                <ConfigProviderWrapper>
                    <App />
                </ConfigProviderWrapper>
            </SeriesProviderWrapper>
        </SlidesProviderWrapper>
    )
}

export default AppLoader