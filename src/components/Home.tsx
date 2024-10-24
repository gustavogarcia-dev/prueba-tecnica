import WithAuth from "./auth/withAuth"
import CsvReader from "./csvReader"
import NavBar from "./nav"

const Home: React.FC = () => {



    return(
        <div className="p-4">
        <NavBar />
        <CsvReader></CsvReader>
        </div>
    )
}

export default WithAuth(Home);