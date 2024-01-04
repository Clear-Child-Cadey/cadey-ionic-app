import React, { useContext, useEffect } from 'react';
import {
  IonItem,
  IonLabel,
  IonCheckbox,
  IonText,
  IonRow,
  IonButton,
  IonLoading,
} from '@ionic/react';
import { play, refresh } from 'ionicons/icons';
import './SymptomsList.css';
import { useHistory } from 'react-router-dom';
// Interfaces
import { Symptom } from '../ConcernsList/ConcernsList';
// Contexts
import { useLoadingState } from '../../context/LoadingStateContext';
import { useModalContext } from '../../context/ModalContext';
import { CadeyUserContext } from '../../main';
import ApiUrlContext from '../../context/ApiUrlContext';
// Modals
import AgeGroupModal from '../../components/Modals/AgeGroupModal/AgeGroupModal';
// API
import { getVideoDetailData } from '../../api/VideoDetail';

interface PopularSymptomData {
    symptomId: number;
    videos: PopularSymptomVideo[];
}

// Define an interface for the popular symptom playlist. This should be an array with the following information per item: Title, VimeoID, Thumbnail
export interface PopularSymptomVideo {
    title: string;
    vimeoId: string;
    mediaId: string;
    thumbnail: string;
}

const PopularSymptomsList: React.FC = () => {  

    // Get the Cadey User data from the context
    const { cadeyUserId, cadeyUserAgeGroup } = useContext(CadeyUserContext);
    const { apiUrl } = useContext(ApiUrlContext);
  
    // Define the symptoms [TODO: Replace with API call]
    const symptoms: Symptom[] = [
        { id: 6, name: 'Easily upset' },
        { id: 35, name: 'Often angry' },
        { id: 62, name: 'Having outbursts' },
        { id: 64, name: 'Throwing temper tantrums' },
        { id: 63, name: 'Having mood swings' },
        { id: 67, name: 'Not following directions' },
    ];

    // Define the popular symptom playlist data
    const popularSymptomData: PopularSymptomData[] = 
    [
        {
            symptomId: 6,
            videos: [
            {
                "title": "Triggers: what they are and how to help",
                "vimeoId": "832356701/9165cff4bd",
                "mediaId": "46",
                "thumbnail": "https://i.vimeocdn.com/video/1716809499-d3028e93a0a64fb906935648db58c0c2d29580ac5a76e1a15d11532e627d3d86-d_1920x1080?r=pad"
            },
            {
                "title": "Kid falling apart? Here's how to reduce meltdowns",
                "vimeoId": "869249831/a3e00c5445",
                "mediaId": "227",
                "thumbnail": "https://i.vimeocdn.com/video/1734672027-090f7e7f84221a3066043cd43f3f32d827f4fabc116cbf910449f6cba9441c2e-d_1920x1080?r=pad"
            },
            {
                "title": "Lizard brain, wizard brain: for kids to see how their brain works",
                "vimeoId": "836629959/6d7d716355",
                "mediaId": "96",
                "thumbnail": "https://i.vimeocdn.com/video/1709379793-14bba12df74cb05fcf8eedb2464502b53cafa286497683d5ade2497ba792145c-d_1920x1080?r=pad"
            },
            {
                "title": "Poker face peacock technique: don't let behavior rattle you",
                "vimeoId": "836198406/611defad41",
                "mediaId": "118",
                "thumbnail": "https://i.vimeocdn.com/video/1684114137-f455e63504a637123579b21b819063ab4b1de145b9acbddaffa2f9ea2fda6f9f-d_1920x1080?r=pad"
            },
            {
                "title": "Coping skills in emotional moments: cozy corner and comfort kit",
                "vimeoId": "888828525/eb2d524e1a",
                "mediaId": "263",
                "thumbnail": "https://i.vimeocdn.com/video/1760147813-ab4a98f419f023587edcc71e68dc9ea7e559509cc5990c1d99b1d940ddd5a45b-d_1920x1080?r=pad"
            },
            {
                "title": "Replace that phrase: to get your kid to follow directions",
                "vimeoId": "871066009/9e432c5508",
                "mediaId": "202",
                "thumbnail": "https://i.vimeocdn.com/video/1733515263-02a5e40bc372dc0308cdf30fdf8ffe2465011275214eeeeae0534aca6c5356c5-d_1920x1080?r=pad"
            },
            {
                "title": "Waterfall count to 10: a step-by-step guide to help your child calm down",
                "vimeoId": "835529495/c2a6bc9e85",
                "mediaId": "30",
                "thumbnail": "https://i.vimeocdn.com/video/1704995284-615ba0bc0d3c193f0315078d3573b4f0421477bb7774d26da620c1f76765bfdc-d_1920x1080?r=pad"
            },
            {
                "title": "How to help your child find their wizard brain: 3 steps you can take",
                "vimeoId": "851688703/0cf6b8e9ef",
                "mediaId": "167",
                "thumbnail": "https://i.vimeocdn.com/video/1709378692-74ea7b54729c821df0d73266d00f8ae9f1d7d2c7d4b9828f8396a7c94dcd346b-d_1920x1080?r=pad"
            },
            {
                "title": "3 things not to do when your child is in lizard brain: managing big emotions",
                "vimeoId": "851687328/e1ea022902",
                "mediaId": "169",
                "thumbnail": "https://i.vimeocdn.com/video/1709380195-47ab4730fbff7dc7ab56a7de3e5939353d5ecdba87c424a99ed5bd97b26b0683-d_1920x1080?r=pad"
            },
            {
                "title": "Developmental trauma: research on psychological distress in children",
                "vimeoId": "842960023/da9b9ccbb7",
                "mediaId": "148",
                "thumbnail": "https://i.vimeocdn.com/video/1694849146-1df92b430c0417aa4602b754f952fdf5caa387fa13608d7b9c3726fd3a9a2531-d_1920x1080?r=pad"
            },
            {
                "title": "Boundaries: set it and forget it",
                "vimeoId": "833401150/c5fb685731",
                "mediaId": "39",
                "thumbnail": "https://i.vimeocdn.com/video/1705032336-f2151a939807ed25ea8add8222d2ffebfc2bbd98ac045a78af4b6a37edc2c88d-d_1920x1080?r=pad"
            },
            {
                "title": "Boundaries: who they are for and how to use them",
                "vimeoId": "835501783/cc646b1c66",
                "mediaId": "75",
                "thumbnail": "https://i.vimeocdn.com/video/1716838628-5aa91a4845e3004ab0a405c08109feaa73197e779ce31f02f5db7ed5e8760ff4-d_1920x1080?r=pad"
            },
            {
                "title": "Punishment vs. restoring justice",
                "vimeoId": "833404677/53d2f677c1",
                "mediaId": "53",
                "thumbnail": "https://i.vimeocdn.com/video/1716814041-e651fc7125dd17c7ae5651f70d99f7ade18725ed8f8502ebfd7c7c9d9b37ad41-d_1920x1080?r=pad"
            },
            {
                "title": "Using restorative justice: when your child does not follow directions",
                "vimeoId": "879855013/b1d35146ec",
                "mediaId": "251",
                "thumbnail": "https://i.vimeocdn.com/video/1746570366-68da8045cdc2c804774bc9856b754acf6a9662da65843a518f668fb92a0fbffd-d_1920x1080?r=pad"
            },
            ],
        },
        {
            symptomId: 35,
            videos: [
    
            {
                "title": "Active listening parenting pitfall: losing your patience",
                "vimeoId": "830290291/b29396446b",
                "mediaId": "8",
                "thumbnail": "https://i.vimeocdn.com/video/1704982845-30247d28a9306c40decc54c0877f6b0f93e8ee255717d72ad371882cf0299003-d_1920x1080?r=pad"
            },
            {
                "title": "Active listening parenting pitfall: interrupting your child",
                "vimeoId": "830289952/54d2700589",
                "mediaId": "9",
                "thumbnail": "https://i.vimeocdn.com/video/1704983188-a1db06ef10d90800a0dbeb781e2390d4a7c58b2679cd32bb0c04e0d857c2dc1d-d_1920x1080?r=pad"
            },
            {
                "title": "Active listening parenting pitfall: underestimating the impact",
                "vimeoId": "830289633/712b888607",
                "mediaId": "10",
                "thumbnail": "https://i.vimeocdn.com/video/1704985399-094c8be5e0efeb487c8f33b259c8baee89dc6f0a1938f40ada2a52805d419071-d_1920x1080?r=pad"
            },
            {
                "title": "Listen first: a 4-step technique to learn to listen to your kids",
                "vimeoId": "830290607/4f5e4a7271",
                "mediaId": "7",
                "thumbnail": "https://i.vimeocdn.com/video/1704982442-3d6936d09b879bff4eb5f9ce982429ab9106ceb24f4e7d938069f88a3238cd15-d_1920x1080?r=pad"
            },
            {
                "title": "Strict parents and the 3 c's of effective parenting",
                "vimeoId": "830270250/bc3c2ff029",
                "mediaId": "50",
                "thumbnail": "https://i.vimeocdn.com/video/1716810718-4d0876070f855cc3c5cda93b93a8f4af7f0a462549a140f5ef6d5a3a7f480031-d_1920x1080?r=pad"
            },
            {
                "title": "What triggers you as a parent?",
                "vimeoId": "870785230/5e1eec15f6",
                "mediaId": "185",
                "thumbnail": "https://i.vimeocdn.com/video/1733516213-ea3f6664bade5637e41ae5e8d975c8473809248b98a757fe1bca85958dfdfddb-d_1920x1080?r=pad"
            },
            {
                "title": "Power of parent modeling: how our words rub off on our kids",
                "vimeoId": "830307169/b37a38bc9e",
                "mediaId": "15",
                "thumbnail": "https://i.vimeocdn.com/video/1704987862-efd8eb7a64442046841a457acd56a88648b10e9b610f3c50c8a7f173f9a80ac3-d_1920x1080?r=pad"
            },
            {
                "title": "Gray rock technique: kids and teens can't argue with a rock",
                "vimeoId": "836198015/bd762145bb",
                "mediaId": "117",
                "thumbnail": "https://i.vimeocdn.com/video/1684103983-cc4eb248557f88ddec61837bb6c9b0a250a8cc611d28cc172f54bd89e2c36530-d_1920x1080?r=pad"
            },
            {
                "title": "Handling misbehavior: they got your goat",
                "vimeoId": "838000810/218c7c8d07",
                "mediaId": "111",
                "thumbnail": "https://i.vimeocdn.com/video/1717261605-95b210e40b5f07bcd5fcbefe9f01be35c219aae9d47c75a6c5f8e190a586c3b8-d_1920x1080?r=pad"
            },
            {
                "title": "Rigid kids: parent do's and don'ts",
                "vimeoId": "840652265/97ea4ba5a0",
                "mediaId": "88",
                "thumbnail": "https://i.vimeocdn.com/video/1717216673-c10b0e6c253591562860625909015ee0fab43bed0f1d03d45da9f12709ee3b6a-d_1920x1080?r=pad"
            },
            {
                "title": "Pick your battles with a stubborn kid",
                "vimeoId": "869250000/3a1731814e",
                "mediaId": "231",
                "thumbnail": "https://i.vimeocdn.com/video/1734691567-481434cd6043db6601068f522d12cba9cd2738c3e259404a7104a1765062df58-d_1920x1080?r=pad"
            },
            {
                "title": "Enmeshment: how to heal the parent-child relationship",
                "vimeoId": "867263757/4f733f37b4",
                "mediaId": "199",
                "thumbnail": "https://i.vimeocdn.com/video/1727858870-66578e9dadd9404709dbdc3fecd1396567f182f27c6b662a29e90ec880bfa68f-d_1920x1080?r=pad"
            },
            {
                "title": "Parenting in the present vs. parenting out of fear",
                "vimeoId": "858697691/fa749cfafb",
                "mediaId": "173",
                "thumbnail": "https://i.vimeocdn.com/video/1716282528-c96bc3227f0631cded83cd1242afb6f46f29a30682b26be427cfe6d5e9b27c2c-d_1920x1080?r=pad"
            },
            {
                "title": "Parent as shepherd vs. engineer",
                "vimeoId": "858697624/5b931d7038",
                "mediaId": "174",
                "thumbnail": "https://i.vimeocdn.com/video/1716285945-ac6f0dd5c2c837761379dbdec51ce4a7ec8ba756f1e9357e65be041f03158539-d_1920x1080?r=pad"
            },
            {
                "title": "Conscious parenting pitfalls and the don't look in the mirror technique",
                "vimeoId": "859013453/64fab0e72e",
                "mediaId": "175",
                "thumbnail": "https://i.vimeocdn.com/video/1716698648-b64c12a6f8b2b4a4d1aef23e8984b98456d4fde513a068047d8758476229ede8-d_1920x1080?r=pad"
            },
            ],
        },
        {
            symptomId: 62,
            videos: [
            {
                "title": "Kid falling apart? Here's how to reduce meltdowns",
                "vimeoId": "869249831/a3e00c5445",
                "mediaId": "227",
                "thumbnail": "https://i.vimeocdn.com/video/1734672027-090f7e7f84221a3066043cd43f3f32d827f4fabc116cbf910449f6cba9441c2e-d_1920x1080?r=pad"
            },
            {
                "title": "Lizard brain, wizard brain: for kids to see how their brain works",
                "vimeoId": "836629959/6d7d716355",
                "mediaId": "96",
                "thumbnail": "https://i.vimeocdn.com/video/1709379793-14bba12df74cb05fcf8eedb2464502b53cafa286497683d5ade2497ba792145c-d_1920x1080?r=pad"
            },
            {
                "title": "How to help your child find their wizard brain: 3 steps you can take",
                "vimeoId": "851688703/0cf6b8e9ef",
                "mediaId": "167",
                "thumbnail": "https://i.vimeocdn.com/video/1709378692-74ea7b54729c821df0d73266d00f8ae9f1d7d2c7d4b9828f8396a7c94dcd346b-d_1920x1080?r=pad"
            },
            {
                "title": "3 things not to do when your child is in lizard brain: managing big emotions",
                "vimeoId": "851687328/e1ea022902",
                "mediaId": "169",
                "thumbnail": "https://i.vimeocdn.com/video/1709380195-47ab4730fbff7dc7ab56a7de3e5939353d5ecdba87c424a99ed5bd97b26b0683-d_1920x1080?r=pad"
            },
            {
                "title": "How is 'saying nothing' when my child is in lizard brain, different from ignoring them?",
                "vimeoId": "880262783/2968fa9a59",
                "mediaId": "234",
                "thumbnail": "https://i.vimeocdn.com/video/1747175588-730fb12973d36e44bf4a88dcaafcd4dc235773a03111ba939843a5a53210300c-d_1920x1080?r=pad"
            },
            {
                "title": "Bossy kids: parent do's and don'ts",
                "vimeoId": "855041614/406a6ea534",
                "mediaId": "92",
                "thumbnail": "https://i.vimeocdn.com/video/1711239007-b62e04c854c49c4a5b28db8bca6e718ea99d6153011b14354e7b7ed8f40ade77-d_1920x1080?r=pad"
            },
            {
                "title": "Listen first: a 4-step technique to learn to listen to your kids",
                "vimeoId": "830290607/4f5e4a7271",
                "mediaId": "7",
                "thumbnail": "https://i.vimeocdn.com/video/1704982442-3d6936d09b879bff4eb5f9ce982429ab9106ceb24f4e7d938069f88a3238cd15-d_1920x1080?r=pad"
            },
            {
                "title": "Replace that phrase: to get your kid to follow directions",
                "vimeoId": "871066009/9e432c5508",
                "mediaId": "202",
                "thumbnail": "https://i.vimeocdn.com/video/1733515263-02a5e40bc372dc0308cdf30fdf8ffe2465011275214eeeeae0534aca6c5356c5-d_1920x1080?r=pad"
            },
            {
                "title": "Power of oops: to help your grouchy kid lighten up and accept mistakes",
                "vimeoId": "835517633/6a6031f98d",
                "mediaId": "26",
                "thumbnail": "https://i.vimeocdn.com/video/1683005404-a340eb2e8d6af5581df7554e40c1a9814e586fa1eea338cffe9cd1b13aac141b-d_1920x1080?r=pad"
            },
            {
                "title": "Punishment vs. consequences: teaching through discipline",
                "vimeoId": "833404447/3fec9b07f4",
                "mediaId": "54",
                "thumbnail": "https://i.vimeocdn.com/video/1716814644-41242afb965af178b073ef743583ee0cedc397773966daf92d36e18e0d813dad-d_1920x1080?r=pad"
            },
            {
                "title": "Rupture and repair: working on the parent-child relationship",
                "vimeoId": "880567661/c47c46a762",
                "mediaId": "178",
                "thumbnail": "https://i.vimeocdn.com/video/1747628292-8ca65f1da70ed9bf4d5487b1586aa25ccf159124ea4f96301809d600ddb3cae0-d_1920x1080?r=pad"
            },
            {
                "title": "No mud, no lotus: to accept when our kids are struggling",
                "vimeoId": "830306830/ea9976440c",
                "mediaId": "18",
                "thumbnail": "https://i.vimeocdn.com/video/1704990512-db2281a3424e0ac6a9f7e48fffbfa1b22a6c894c30078f92863c94a9e94ef472-d_1920x1080?r=pad"
            },
            {
                "title": "Lawnmower parents & snowplow parents",
                "vimeoId": "879497563/eb356bb497",
                "mediaId": "257",
                "thumbnail": "https://i.vimeocdn.com/video/1746054544-2dbffcf6e3580dd5208f9439169e66998145a08c3c08c17ea543c19da220f2fe-d_1920x1080?r=pad"
            },
            {
                "title": "Accountability: what to do when your child won't own mistakes",
                "vimeoId": "882237697/03c63a650d",
                "mediaId": "179",
                "thumbnail": "https://i.vimeocdn.com/video/1750204057-d5ada47711f7261dac7a47000710f9bdfd9f6ce6bbf22396618659aeeac942c0-d_1920x1080?r=pad"
            },
            {
                "title": "Developmental trauma: research on psychological distress in children",
                "vimeoId": "842960023/da9b9ccbb7",
                "mediaId": "148",
                "thumbnail": "https://i.vimeocdn.com/video/1694849146-1df92b430c0417aa4602b754f952fdf5caa387fa13608d7b9c3726fd3a9a2531-d_1920x1080?r=pad"
            },
            {
                "title": "Triggers & accountability: an example of getting your kid to school",
                "vimeoId": "836233537/f122ad9444",
                "mediaId": "119",
                "thumbnail": "https://i.vimeocdn.com/video/1684539470-115530b0733e28eb49b138e86f66b598bd9860d51a5d8ab75d82deeec9054761-d_1920x1080?r=pad"
            },
            ],
        },
        {
            symptomId: 63, 
            videos: [
            {
                "title": "Books for bad days",
                "vimeoId": "877192113/f4399e379d",
                "mediaId": "243",
                "thumbnail": "https://i.vimeocdn.com/video/1742608288-f1fdca07fe74487f051d46effa5eb2debc9a244290915e1136e657818e314c59-d_1920x1080?r=pad"
            },
            {
                "title": "The magic 5:1 ratio: how to have better relationships with kids",
                "vimeoId": "853409480/81407ca2e1",
                "mediaId": "63",
                "thumbnail": "https://i.vimeocdn.com/video/1708945852-241168bd478c4a355573f39d758b69b51d87e4330b76380cecc6bb6d7afe468f-d_1920x1080?r=pad"
            },
            {
                "title": "Active visualization: teach your child to use the 1 minute vacation",
                "vimeoId": "830290774/98374faf86",
                "mediaId": "6",
                "thumbnail": "https://i.vimeocdn.com/video/1704982161-29eadf9158154587001d6264bf9d9dfbb88c92508b4af5a83da7c0afc114fb4a-d_1920x1080?r=pad"
            },
            {
                "title": "Expectations: responding to setbacks and disappointments",
                "vimeoId": "855073772/36f428a38d",
                "mediaId": "22",
                "thumbnail": "https://i.vimeocdn.com/video/1711279914-378896c53d28f263a6f60047e72d60430d4b547c6b1a0ce3750ba28b81133d85-d_1920x1080?r=pad"
            },
            {
                "title": "Quieting mental chatter: guided meditation resources for families",
                "vimeoId": "838728008/3954b52ba9",
                "mediaId": "23",
                "thumbnail": "https://i.vimeocdn.com/video/1704993127-18e189edb58375b37a3c5421875271eadcdba40a2220e5b4d88abc9866bf490d-d_1920x1080?r=pad"
            },
            {
                "title": "Mistakes on planet earth: perfectionist kids learn to accept mistakes",
                "vimeoId": "830307486/362ea9c8ff",
                "mediaId": "14",
                "thumbnail": "https://i.vimeocdn.com/video/1704986826-580e2fcee4932326426672b94f1116966b483ddb435d0bb4dfec12a93e86ac9a-d_1920x1080?r=pad"
            },
            {
                "title": "Take out the trash: for kids to release negative thought patterns",
                "vimeoId": "833400388/3ec6352552",
                "mediaId": "37",
                "thumbnail": "https://i.vimeocdn.com/video/1705031727-056ddd8da9664c014d3f90bff77b0b65ba8912388472552070a8eaf2576eb1b8-d_1920x1080?r=pad"
            },
            {
                "title": "World is happening place: for kids to lighten up and handle setbacks",
                "vimeoId": "833400944/5c58aefb9b",
                "mediaId": "38",
                "thumbnail": "https://i.vimeocdn.com/video/1705031976-cd9777499b57d956cb85d9ae796f91e3460c79e2f0b19e6687632f8bd4f099d2-d_1920x1080?r=pad"
            },
            {
                "title": "Replacing negative thoughts: how to handle disappointment ",
                "vimeoId": "836215432/6e8e101aad",
                "mediaId": "95",
                "thumbnail": "https://i.vimeocdn.com/video/1717252169-07835c378190d278f78930c1b18a85d7365479e4463098b379b5bcebc39a3848-d_1920x1080?r=pad"
            },
            {
                "title": "What to do about your child's triggers: Is your child triggered by hearing no?",
                "vimeoId": "863640207/ebc427a839",
                "mediaId": "184",
                "thumbnail": "https://i.vimeocdn.com/video/1722918420-8bbb41de1c08962e19986cf3e7d583a0c2c0c5b69097c6d14a757e2c88d76347-d_1920x1080?r=pad"
            },
            {
                "title": "Cognitive distortions: don't let negative thought patterns get in the way of your communication",
                "vimeoId": "855822095/6cd93f88ff",
                "mediaId": "170",
                "thumbnail": "https://i.vimeocdn.com/video/1713278038-b6ba71d809339d2e1b2131f2288d7d8d9e9d8238ff86b8a6d4b3851d3ead0314-d_1920x1080?r=pad"
            },
            {
                "title": "Cognitive distortions: change that thought",
                "vimeoId": "855821859/836c665a54",
                "mediaId": "171",
                "thumbnail": "https://i.vimeocdn.com/video/1713279079-31cebf4b2cc0572813ea2b3623ea0df174387dd6f9e4fa8ba32d73f49d1377b6-d_1920x1080?r=pad"
            },
            {
                "title": "Cognitive distortions: personalization in teenagers",
                "vimeoId": "855821487/75903e7eb8",
                "mediaId": "172",
                "thumbnail": "https://i.vimeocdn.com/video/1713279706-2cfa1359319dde10ebeaed21577099e9e06f4acd217db4d9db8d2cc0678f5268-d_1920x1080?r=pad"
            },
            ],
        },
        {
            symptomId: 64,
            videos: [
    
            {
                "title": "Tantrum protocol for school-aged children: how to manage meltdowns",
                "vimeoId": "835529695/43aec125c6",
                "mediaId": "100",
                "thumbnail": "https://i.vimeocdn.com/video/1717254149-4884733ad13193106be66e09c73c6092322f6b898bccb86b2a5ac61064c3a5e3-d_1920x1080?r=pad"
            },
            {
                "title": "Downshifting: tackling tantrums and meltdowns in your child",
                "vimeoId": "835519075/941972b4bd",
                "mediaId": "103",
                "thumbnail": "https://i.vimeocdn.com/video/1717255373-1cda43411317938f80244cd7cac47dd7b327d6d1eeecb27c2c8b21766a24edb3-d_1920x1080?r=pad"
            },
            {
                "title": "Age expectations for emotional regulation",
                "vimeoId": "871069391/9cee5e91ac",
                "mediaId": "214",
                "thumbnail": "https://i.vimeocdn.com/video/1733506772-cae4ff4c183caaf4af216429900aa48840c8a2456d16b71f7a9bf71c33623f46-d_1920x1080?r=pad"
            },
            {
                "title": "Kid falling apart? Here's how to reduce meltdowns",
                "vimeoId": "869249831/a3e00c5445",
                "mediaId": "227",
                "thumbnail": "https://i.vimeocdn.com/video/1734672027-090f7e7f84221a3066043cd43f3f32d827f4fabc116cbf910449f6cba9441c2e-d_1920x1080?r=pad"
            },
            {
                "title": "Lizard brain, wizard brain: for kids to see how their brain works",
                "vimeoId": "836629959/6d7d716355",
                "mediaId": "96",
                "thumbnail": "https://i.vimeocdn.com/video/1709379793-14bba12df74cb05fcf8eedb2464502b53cafa286497683d5ade2497ba792145c-d_1920x1080?r=pad"
            },
            {
                "title": "How to help your child find their wizard brain: 3 steps you can take",
                "vimeoId": "851688703/0cf6b8e9ef",
                "mediaId": "167",
                "thumbnail": "https://i.vimeocdn.com/video/1709378692-74ea7b54729c821df0d73266d00f8ae9f1d7d2c7d4b9828f8396a7c94dcd346b-d_1920x1080?r=pad"
            },
            {
                "title": "How is 'saying nothing' when my child is in lizard brain, different from ignoring them?",
                "vimeoId": "880262783/2968fa9a59",
                "mediaId": "234",
                "thumbnail": "https://i.vimeocdn.com/video/1747175588-730fb12973d36e44bf4a88dcaafcd4dc235773a03111ba939843a5a53210300c-d_1920x1080?r=pad"
            },
            {
                "title": "Triggers: what they are and how to help",
                "vimeoId": "832356701/9165cff4bd",
                "mediaId": "46",
                "thumbnail": "https://i.vimeocdn.com/video/1716809499-d3028e93a0a64fb906935648db58c0c2d29580ac5a76e1a15d11532e627d3d86-d_1920x1080?r=pad"
            },
            {
                "title": "What to do about your child's triggers: Is your child triggered by hearing no?",
                "vimeoId": "863640207/ebc427a839",
                "mediaId": "184",
                "thumbnail": "https://i.vimeocdn.com/video/1722918420-8bbb41de1c08962e19986cf3e7d583a0c2c0c5b69097c6d14a757e2c88d76347-d_1920x1080?r=pad"
            },
            {
                "title": "What triggers you as a parent?",
                "vimeoId": "870785230/5e1eec15f6",
                "mediaId": "185",
                "thumbnail": "https://i.vimeocdn.com/video/1733516213-ea3f6664bade5637e41ae5e8d975c8473809248b98a757fe1bca85958dfdfddb-d_1920x1080?r=pad"
            },
            {
                "title": "Strict parents: when punishment is a problem",
                "vimeoId": "832362367/7eb49b66e5",
                "mediaId": "49",
                "thumbnail": "https://i.vimeocdn.com/video/1678179499-407a586ce6535c0cd957be767d4c2a54f18bf89f243ebc8a93afe64ea6d0593b-d_1920x1080?r=pad"
            },
            {
                "title": "Strict parents and the 3 c's of effective parenting",
                "vimeoId": "830270250/bc3c2ff029",
                "mediaId": "50",
                "thumbnail": "https://i.vimeocdn.com/video/1716810718-4d0876070f855cc3c5cda93b93a8f4af7f0a462549a140f5ef6d5a3a7f480031-d_1920x1080?r=pad"
            },
            {
                "title": "Strict parents at the park: why does it look so good?",
                "vimeoId": "830270037/ce58f6c51e",
                "mediaId": "51",
                "thumbnail": "https://i.vimeocdn.com/video/1716811039-8af3ef5a6af040651f5dcdf020dd164d6a281b44e2e91b750f35d08513490f7b-d_1920x1080?r=pad"
            },
            {
                "title": "Punishment: like a speeding ticket",
                "vimeoId": "833404222/584cf8dc47",
                "mediaId": "52",
                "thumbnail": "https://i.vimeocdn.com/video/1716812861-3a2f87137325a267281ac586cda049825b9da12866c58750cbc4226b4ddc834d-d_1920x1080?r=pad"
            },
            {
                "title": "Punishment vs. restoring justice",
                "vimeoId": "833404677/53d2f677c1",
                "mediaId": "53",
                "thumbnail": "https://i.vimeocdn.com/video/1716814041-e651fc7125dd17c7ae5651f70d99f7ade18725ed8f8502ebfd7c7c9d9b37ad41-d_1920x1080?r=pad"
            },
            {
                "title": "Punishment vs. consequences: teaching through discipline",
                "vimeoId": "833404447/3fec9b07f4",
                "mediaId": "54",
                "thumbnail": "https://i.vimeocdn.com/video/1716814644-41242afb965af178b073ef743583ee0cedc397773966daf92d36e18e0d813dad-d_1920x1080?r=pad"
            },
            ],
        },
        {
            symptomId: 67,
            videos: [
    
            {
                "title": "Active listening parenting pitfall: losing your patience",
                "vimeoId": "830290291/b29396446b",
                "mediaId": "8",
                "thumbnail": "https://i.vimeocdn.com/video/1704982845-30247d28a9306c40decc54c0877f6b0f93e8ee255717d72ad371882cf0299003-d_1920x1080?r=pad"
            },
            {
                "title": "3 steps to getting your child to follow your directions at home",
                "vimeoId": "855048900/c5036cbce8",
                "mediaId": "182",
                "thumbnail": "https://i.vimeocdn.com/video/1711321134-fd2aedff2fe7e8753719c6d9d050293090466b8432a8798c05ba5b13a79a23a4-d_1920x1080?r=pad"
            },
            {
                "title": "Replace that phrase: to get your kid to follow directions",
                "vimeoId": "871066009/9e432c5508",
                "mediaId": "202",
                "thumbnail": "https://i.vimeocdn.com/video/1733515263-02a5e40bc372dc0308cdf30fdf8ffe2465011275214eeeeae0534aca6c5356c5-d_1920x1080?r=pad"
            },
            {
                "title": "Following directions formula: to help with memory and comprehension",
                "vimeoId": "867264345/c537d8ffdc",
                "mediaId": "177",
                "thumbnail": "https://i.vimeocdn.com/video/1727852069-d016cdd12ed64ccd77c7b303f2ebf3b2833780044c5c34a32a7ea14769c6057e-d_1920x1080?r=pad"
            },
            {
                "title": "Sequential reasoning: why it may be tripping up your child",
                "vimeoId": "867263823/7fe44c6de1",
                "mediaId": "180",
                "thumbnail": "https://i.vimeocdn.com/video/1727854652-21644e3e7fef377bbad12f3352be9215749ee051118dff5ed48bc5b35d9b5b37-d_1920x1080?r=pad"
            },
            {
                "title": "Reward system pitfall: you get stuck on the mistakes",
                "vimeoId": "842960680/53fb4098a9",
                "mediaId": "61",
                "thumbnail": "https://i.vimeocdn.com/video/1716818367-f1ef7cf3057e3b5e8a0c0558e48efd4dd72abbba66b2170552fe0c0b4ee6c25f-d_1920x1080?r=pad"
            },
            {
                "title": "Patience and support, not wonka wonka: when our kids don't listen well",
                "vimeoId": "836587577/0e5ac6e670",
                "mediaId": "121",
                "thumbnail": "https://i.vimeocdn.com/video/1684612614-b2355cc8a83094474f974f46f1a53e442a16382407c7a952d895c7e19b21f825-d_1920x1080?r=pad"
            },
            {
                "title": "Compassion and learning: ADHD and following directions",
                "vimeoId": "870786518/acfd74e322",
                "mediaId": "222",
                "thumbnail": "https://i.vimeocdn.com/video/1733509711-69a72e8fd5dadd336d253cd29733f8e6a683aae0426c27cadb221822e8019fef-d_1920x1080?r=pad"
            },
            {
                "title": "Teaching in the moment: ADHD and following directions",
                "vimeoId": "871066109/ff26940c08",
                "mediaId": "224",
                "thumbnail": "https://i.vimeocdn.com/video/1733510950-f270c8fa5c948b5f35103783834e1f2b5963e5df77d106e01d318886081a7b89-d_1920x1080?r=pad"
            },
            {
                "title": "Using restorative justice: when your child does not follow directions",
                "vimeoId": "879855013/b1d35146ec",
                "mediaId": "251",
                "thumbnail": "https://i.vimeocdn.com/video/1746570366-68da8045cdc2c804774bc9856b754acf6a9662da65843a518f668fb92a0fbffd-d_1920x1080?r=pad"
            },
            {
                "title": "Boundaries: who they are for and how they work",
                "vimeoId": "870747322/6d8c25a17b",
                "mediaId": "230",
                "thumbnail": "https://i.vimeocdn.com/video/1734685886-b0be3f881562a5b3ea2d7b2f2178c6655294a618a9019edce0bed4416087b895-d_1920x1080?r=pad"
            },
            {
                "title": "Schedules and routines: 3 common mistakes parents make",
                "vimeoId": "830269476/e48f40d722",
                "mediaId": "12",
                "thumbnail": "https://i.vimeocdn.com/video/1675022435-8e59d2150d5b6e3d3ffbe1ac7b1d5046eeddec787d00cd6c5f95f993b34ab289-d_1920x1080?r=pad"
            },
            {
                "title": "Use visuals: for structuring routines in your home",
                "vimeoId": "830288735/a5af6c8ea7",
                "mediaId": "13",
                "thumbnail": "https://i.vimeocdn.com/video/1704986441-69a4dae836380fd107fa61b2a1f0af2b7b84aee484d8e0c8fd2eadc47ab865b5-d_1920x1080?r=pad"
            },
            {
                "title": "Eight must-haves for a family schedule",
                "vimeoId": "876030295/3548445b80",
                "mediaId": "206",
                "thumbnail": "https://i.vimeocdn.com/video/1740827098-3f44ef1c4d7aca8615f7d18dca4ae2de63a0cfb6f633362c679f189d04122af3-d_1920x1080?r=pad"
            },
            {
                "title": "Rewards vs. bribes: positive reinforcement is different than bribing kids",
                "vimeoId": "830262409/402ab40c6c",
                "mediaId": "27",
                "thumbnail": "https://i.vimeocdn.com/video/1704993845-e2647ebd44d32b686099e513fd8f240b300f66359328c2866f19770d2d3af1c1-d_1920x1080?r=pad"
            },
            {
                "title": "Reward systems: intrinsic and extrinsic motivation",
                "vimeoId": "833404904/60820649ba",
                "mediaId": "55",
                "thumbnail": "https://i.vimeocdn.com/video/1716815103-83284bc50f58ce36d6616c1405191bacabe155442a45220a23f36a525db144c4-d_1920x1080?r=pad"
            },
            {
                "title": "Reward system pitfall: you forget to use it",
                "vimeoId": "830258872/e2eb553e73",
                "mediaId": "58",
                "thumbnail": "https://i.vimeocdn.com/video/1716816517-2f7d5a026c320e6590bc78fb05fa634dd79b0848f09b23ebe314b0438123b853-d_1920x1080?r=pad"
            },
            {
                "title": "Parenting pitfall: being unclear about the rules",
                "vimeoId": "837999787/a3cb413dc0",
                "mediaId": "89",
                "thumbnail": "https://i.vimeocdn.com/video/1717217127-44769c4e8267b7b956ea2848beb2e22866a0aa1567ff10c737ab592eef04504f-d_1920x1080?r=pad"
            },
            {
                "title": "Pitfall: making a transition too fast",
                "vimeoId": "840171053/3621e13a09",
                "mediaId": "135",
                "thumbnail": "https://i.vimeocdn.com/video/1690640160-32f54a5716482c7c425ada60a1f471344af2fcee91788aaec780fd4dc5a7710f-d_1920x1080?r=pad"
            },
            {
                "title": "Parenting tip: make the transition positive",
                "vimeoId": "842957946/f8811770ff",
                "mediaId": "137",
                "thumbnail": "https://i.vimeocdn.com/video/1694847727-37f5a4e638b323d0e616b227b04c6e0cdc060174eacf934edfbb774c12988f54-d_1920x1080?r=pad"
            },
            {
                "title": "When you have to make a quick transition: an example of playtime to tutoring",
                "vimeoId": "842958289/e5038aa729",
                "mediaId": "138",
                "thumbnail": "https://i.vimeocdn.com/video/1694847921-c1a24048a8cce5260b082c663ecdb32599ed51cc36bb2a7b2bd28562d8378013-d_1920x1080?r=pad"
            },
            ],
        },
    ];

    // Get all the props from the modal context
    const { 
        isAgeGroupModalOpen,
        setAgeGroupModalOpen,
        setPopularSymptomId,
        isPopularSymptomVideoModalOpen,
        setIsPopularSymptomVideoModalOpen, 
        popularSymptomVideo,
        setPopularSymptomVideo,
        popularSymptomPlaylist,
        setPopularSymptomPlaylist,
    } = useModalContext();

    // Get the loading state from the context
    const { state: loadingState, dispatch } = useLoadingState();
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const history = useHistory();
    const [selectedSymptoms, setSelectedSymptoms] = React.useState<Symptom[]>([]);

    const handleSymptomChange = (symptom: Symptom, checked: boolean) => {
        if (checked) {
            setSelectedSymptoms([...selectedSymptoms, symptom]);
        } else {
            setSelectedSymptoms(selectedSymptoms.filter((s) => s.id !== symptom.id));
        }
    };

    const onViewAllSymptoms = () => {
        setSelectedSymptoms([]);
        // Navigate to the Concerns page
        history.push('/App/Concerns');
    };

    // If the popularSymptomPlaylist changes, set the popular symptom video to the first item in the playlist
    useEffect(() => {
        if (popularSymptomPlaylist.length > 0) {
            setPopularSymptomVideo(popularSymptomPlaylist[0]);
        }
        
    }, [popularSymptomPlaylist]);

    const handlePopularSymptomSelection = async (selectedSymptoms: Symptom[]) => {

        setPopularSymptomId(selectedSymptoms[0].id);

        // Check if the user has an age group
        if (cadeyUserAgeGroup === 0) {
            // Open the age group modal
            setAgeGroupModalOpen(true);
            // Return early - the callback on age group seletion will call this function again
            return;
        }

        getPopularVideoData();
    };

    const getPopularVideoData = async () => {        
        
        // TODO: Replace this with an API call to get the video ID and next video ID
        
        // Set the popular symptom playlist to the videos associated with the selected symptom
        setPopularSymptomPlaylist(popularSymptomData.find((symptom) => symptom.symptomId === selectedSymptoms[0].id)?.videos || []);

        // Open the video detail modal
        setIsPopularSymptomVideoModalOpen(true);

        // Clear symptom selections so the user can select a new symptom when they return
        setSelectedSymptoms([]);
    }

    const onAgeGroupSelected = async (selectedAgeGroup: number) => {
        getPopularVideoData();
    }

    // Log selected symptoms anytime they change
    useEffect(() => {
        console.log('Selected symptoms:', selectedSymptoms);
    }, [selectedSymptoms]);
    

  return (
    <div className="symptoms-container">

        {/* Show a loading state if necessary */}
        {isLoading && (
          <IonLoading isOpen={true} message={'Loading data...'} />
        )}

        {/* Show an age group modal if context dictates */}
        <AgeGroupModal isOpen={isAgeGroupModalOpen} onAgeGroupSelected={onAgeGroupSelected} />
        <IonRow>
            <IonText className="subcopy">Is your child...</IonText>
        </IonRow>
        {symptoms.map((symptom) => (
            <IonItem className="symptom-item" lines="none" key={symptom.id}>
            <IonLabel className="symptom-label">{symptom.name}</IonLabel>
            <IonCheckbox
                mode="ios"
                className="symptom-checkbox"
                slot="start"
                checked={selectedSymptoms.some((s) => s.id === symptom.id)}
                onIonChange={(e) => handleSymptomChange(symptom, e.detail.checked)}
                disabled={selectedSymptoms.length >= 1 && !selectedSymptoms.some((s) => s.id === symptom.id)}
            />
            </IonItem>
        ))}
        
        <IonRow className="bottom-row">
            <IonButton expand="block" onClick={onViewAllSymptoms} color="secondary" aria-label="Restart">
            View All Symptoms
            </IonButton>
            <IonButton 
            expand="block" 
            onClick={() => handlePopularSymptomSelection(selectedSymptoms)}
            disabled={selectedSymptoms.length === 0}
            >
            Continue
            </IonButton>
        </IonRow>
    </div>
  );
};

export default PopularSymptomsList;