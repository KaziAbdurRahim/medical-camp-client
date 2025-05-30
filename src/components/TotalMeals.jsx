import CountUp from "react-countup";

const TotalMeals = () => {
  return (
    <div className="card lg:card-side bg-base-100 shadow-xl pb-4 max-w-sm sm:max-w-lg lg:max-w-5xl mx-auto">
      <figure className="h-full w-96 lg:w-[484px] object-cover mx-auto">
        <img
          //   src={FoodPic}
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsAtgjQc2a8kv6cPVEvUPS9_ex1aYPAU8YQQ&s"
          alt="Album"
        />
      </figure>

      <div className="card-body">
        <h2 className="card-title justify-center text-4xl lg:mt-20">
          Total Campaing
        </h2>
        <div className="grow flex justify-center items-center lg:mb-20">
          <CountUp
            start={0}
            end={2613}
            duration={16}
            suffix="+"
            enableScrollSpy={true}
            scrollSpyDelay={100}
            scrollSpyOnce={true}
          >
            {({ countUpRef }) => (
              <div className="text-3xl font-bold my-5 btn h-auto px-6 py-2 btn-active">
                <span ref={countUpRef} />
              </div>
            )}
          </CountUp>
        </div>
        <div className="card-actions justify-end">
          <a href="">
            <button className="btn btn-primary">Discover</button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default TotalMeals;
