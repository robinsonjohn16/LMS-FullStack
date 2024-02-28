import aboutMainImage from '../assets/Images/aboutMainImage.png'
import CarouselSlide from '../Components/CarouselSlide'
import { carouselData } from '../Constants/calouserData';
import HomeLayout from "../Layouts/HomeLayout"

function AboutUs(){

   

    return(
        <HomeLayout>
            <div className=" pl-20 h-[90vh] flex flex-col text-white">
                <div className="flex items-center gap-5 mx-10 my-0 ">
                    <section className="w-1/2 space-y-10">
                        <h1 className="text-5xl font-semibold text-yellow-400">Affordable and quality education</h1>
                        <p className=" text-xl">
                            Our goal is to provide the affordable and quality education to the world. We are providing the platform for the aspiring teachers and students to share their skills, creativity and knowledge to each other to empower and contribute in the growth and wellness of  manking.
                        </p>
                    </section>
                    <div className="w-1/2 ">
                        <img
                         filter='drop-shadow(0 10px 10px rgb(0,0,0))'
                         id='test1'
                         
                         className='drop-shadow-2xl'
                         src={aboutMainImage} 
                         alt="about Main Image" />
                    </div>
                </div>
                <div className="carousel w-3/12 h-[250px] mx-auto  rounded-full">
                    {carouselData&&carouselData.map((item)=><CarouselSlide {...item} key={item.slideNum} totalslide={carouselData.length}/>)}
                </div>
            </div>
        </HomeLayout>
    )
}

export default AboutUs;