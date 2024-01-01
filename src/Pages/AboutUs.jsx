import aboutMainImage from '../assets/Images/aboutMainImage.png'
import apj from '../assets/Images/QuotesPersonalityImage/apj.png'
import billGates from '../assets/Images/QuotesPersonalityImage/billGates.png'
import einstein from '../assets/Images/QuotesPersonalityImage/einstein.png'
import nelsonmandela from '../assets/Images/QuotesPersonalityImage/nelsonmandela.png'
import steveJobs from '../assets/Images/QuotesPersonalityImage/steveJobs.png'
import HomeLayout from "../Layouts/HomeLayout"

function AboutUs(){

    return(
        <HomeLayout>
            <div className="pl-20 pt-20 flex flex-col text-white">
                <div className="flex items-center gap-5 mx-10">
                    <section className="w-1/2 space-y-10">
                        <h1 className="text-5xl font-semibold text-yellow-400">Affordable and quality education</h1>
                        <p className=" text-xl">
                            Our goal is to provide the affordable and quality education to the world. We are providing the platform for the aspiring teachers and students to share their skills, creativity and knowledge to each other to empower and contribute in the growth and wellness of  manking.
                        </p>
                    </section>
                    <div className="w-1/2">
                        <img
                         filter='drop-shadow(0 10px 10px rgb(0,0,0))'
                         id='test1'
                         className='drop-shadow-2xl'
                         src={aboutMainImage} 
                         alt="about Main Image" />
                    </div>
                </div>
                <div className="carousel w-3/12 h-[250px] my-16 mx-auto border rounded-full">
                    <div id="slide1" className="carousel-item relative w-full">
                        <img src={steveJobs} className="w-full" />
                        <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                            <a href="#slide5" className="btn btn-circle">❮</a> 
                            <a href="#slide2" className="btn btn-circle">❯</a>
                        </div>
                        <div className='hidden md:block absolute text-center bottom-1 left-6 w-[80%]'>
                            <p className='text-gray-400'>“The truth will set you free.”</p>
                            <h3 className='text-white font-bold'>Steve Jobs</h3>
                        </div>
                    </div> 
                    <div id="slide2" className="carousel-item relative w-full">
                        <img src={apj} className="w-full" />
                        <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                            <a href="#slide1" className="btn btn-circle">❮</a> 
                            <a href="#slide3" className="btn btn-circle">❯</a>
                        </div>
                        <div className='hidden md:block absolute text-center bottom-1 left-6 w-[80%]'>
                            <p className='text-gray-400'>“The truth will set you free.”</p>
                            <h3 className='text-white font-bold'>Abdul Kalam</h3>
                        </div>
                    </div> 
                    <div id="slide3" className="carousel-item relative w-full">
                        <img src={billGates} className="w-full" />
                        <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                            <a href="#slide2" className="btn btn-circle">❮</a> 
                            <a href="#slide4" className="btn btn-circle">❯</a>
                        </div>
                        <div className='hidden md:block absolute text-center bottom-1 left-6 w-[80%]'>
                            <p className='text-gray-400'>“The truth will set you free.”</p>
                            <h3 className='text-white font-bold'>Bill Gates</h3>
                        </div>
                    </div> 
                    <div id="slide4" className="carousel-item relative w-full">
                        <img src={einstein} className="w-full" />
                        <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                            <a href="#slide3" className="btn btn-circle">❮</a> 
                            <a href="#slide5" className="btn btn-circle">❯</a>
                        </div>
                        <div className='hidden md:block absolute text-center bottom-1 left-6 w-[80%]'>
                            <p className='text-gray-400'>“The truth will set you free.”</p>
                            <h3 className='text-white font-bold'>Albert Einstein</h3>
                        </div>
                    </div>
                    <div id="slide5" className="carousel-item relative w-full">
                        <img src={nelsonmandela} className="w-full" />
                        <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                            <a href="#slide4" className="btn btn-circle">❮</a> 
                            
                            <a href="#slide1" className="btn btn-circle">❯</a>
                        </div>
                        <div className='hidden md:block absolute text-center bottom-1 left-6 w-[80%]'>
                            <p className='text-gray-400'>“It is in your hands, to make a better world for all who live in it.”</p>
                            <h3 className='text-white font-bold'>Nelson Mandela</h3>
                        </div>
                    </div>
                </div>
            </div>
        </HomeLayout>
    )
}

export default AboutUs;