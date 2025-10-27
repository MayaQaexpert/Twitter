import Image from 'next/image';
import SideMenuItem from './SideMenuItem';
import { BiHomeCircle } from 'react-icons/bi';
import { FaSearch } from 'react-icons/fa';
import { RiInboxLine } from 'react-icons/ri';
import { IoNotificationsOutline, IoPlanet} from 'react-icons/io5';
import { CgProfile } from 'react-icons/cg';
import {IoIosMore} from 'react-icons/io';

export default function Sidebar() {
  return (
    <>
      <div className="hoverEffect p-2 ">
        <Image
          src="https://img.icons8.com/?size=100&id=fJp7hepMryiw&format=png"
          width={40}
          height={40}
          alt="Icon"
        />
      </div>
      <div className="hoverEffect p-2 
       ">
        <SideMenuItem text="Home" Icon={BiHomeCircle} />
        <SideMenuItem text="Explore" Icon={FaSearch} />
        <SideMenuItem text="Notifications" Icon={IoNotificationsOutline} />
        <SideMenuItem text="Message" Icon={RiInboxLine} />
        <SideMenuItem text="Grok" Icon={IoPlanet} />
        <SideMenuItem text="Profile" Icon={CgProfile} />
        <SideMenuItem text="More" Icon={IoIosMore} />
      </div>
      <div className="hoverEffect p-2 
       ">
        <Image  width={70}
          height={70}src="https://media.licdn.com/dms/image/v2/D4E03AQEna1ddNOyEeg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1719568062911?e=1762992000&v=beta&t=FFY2wGP4AtQM2BxwmYuRUFgCrL_qExR-BIpVrhsHCws" alt='user-image'></Image>
      </div>
    </>
  );
}
