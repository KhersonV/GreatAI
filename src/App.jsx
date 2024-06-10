import React, { useState, useRef } from 'react'
import Section					from './components/Section'
import { Carousel }			from './components/Carousel'
import { InputScreen }	from './components/InputScreen'
// import { slides }				from './assets/data/carouselData.json'
import Heroes from './components/Heroes'


const	App = () => {
	const	[heroIdx, setHeroIdx] = useState(0);

	return (
		<>
			<Section sec_id={"section-1"}>
				<Carousel heroes={Heroes} heroIdx={heroIdx} setHeroIdx={setHeroIdx} />
			</Section>
			<Section sec_id={"section-2"}>
				<InputScreen heroes={Heroes} heroIdx={heroIdx} />
			</Section>
		</>
	)
}

export default App
