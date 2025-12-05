import Details from '../Details'
import Hero from '../Hero'
import HeroAndDetails from '../HeroAndDetails'
import Map from '../Map'
import SimilarAnnouncements from '../SimilarAnnouncements'

const page = async ({ params }) => {

  const { id } = await params

  return (
    <>
    <HeroAndDetails id={id} />
      {/* <Map />
      <SimilarAnnouncements /> */}
    </>
  )
}

export default page
