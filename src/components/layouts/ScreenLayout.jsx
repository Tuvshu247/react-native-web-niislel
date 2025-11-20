/* eslint-disable react/no-unstable-nested-components */
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CustomHeader from '../ui/CustomHeader';

const Stack = createNativeStackNavigator();

import NewsInfo from '@/screens/shared/NewsInfo';
import LeaveRequest from '@/screens/shared/LeaveRequest';
import LeaveRequestSend from '@/screens/shared/LeaveRequestSend';
import MeetingHistory from '@/screens/shared/MeetingHistory';
import MeetingHistoryDetail from '@/screens/shared/MeetingHistory/MeetingHistoryDetail';
import QuickAnnouncement from '@/screens/shared/QuickAnnouncement';
import DigitalMeeting from '@/screens/shared/DigitalMeeting';
import AttendanceReport from '@/screens/shared/AttendanceReport';
import Gallery from '@/screens/shared/Gallery';
import AlbumImages from '@/screens/shared/Gallery/AlbumImages';
import Statistics from '@/screens/shared/Statistics';
import PhoneList from '@/screens/shared/PhoneList';
import AddChatUsers from '@/screens/shared/AddChatUsers';
import ApproveLeaveRequest from '@/screens/shared/ApproveLeaveRequest';
import EditRequest from '@/screens/shared/ApproveLeaveRequest/EditRequest';
import SendQuickAnnouncement from '@/screens/shared/SendQuickAnnouncement';
import MeetingReview from '@/screens/shared/MeetingReview';

const ScreenLayout = () => {
    return (
        <Stack.Navigator
            screenOptions={({ route, navigation }) => ({
                header: ({ options }) => (
                    <CustomHeader
                        title={options.title || route.name}
                        canGoBack={navigation.canGoBack()}
                    />
                ),
            })}
        >
            <Stack.Screen
                name="NewsInformation"
                component={NewsInfo}
                options={{ title: 'Мэдээ мэдээлэл' }}
            />
            <Stack.Screen
                name="LeaveRequest"
                component={LeaveRequest}
                options={{ title: 'Чөлөөний хүсэлт' }}
            />
            <Stack.Screen
                name="LeaveRequestSend"
                component={LeaveRequestSend}
                options={{ title: 'Чөлөөний хүсэлт илгээх' }}
            />
            <Stack.Screen
                name="MeetingHistory"
                component={MeetingHistory}
                options={{ title: 'Хуралдааны түүх' }}
            />
            <Stack.Screen
                name="MeetingHistoryDetail"
                component={MeetingHistoryDetail}
                options={{ title: 'Хуралдааны дэлгэрэнгүй' }}
            />
            <Stack.Screen
                name="QuickAnnouncement"
                component={QuickAnnouncement}
                options={{ title: 'Шуурхай зар' }}
            />
            <Stack.Screen
                name="DigitalMeeting"
                component={DigitalMeeting}
                options={{ title: 'Цахим хурал' }}
            />
            <Stack.Screen
                name="AttendanceReport"
                component={AttendanceReport}
                options={{ title: 'Ирцийн мэдээ' }}
            />
            <Stack.Screen
                name="Gallery"
                component={Gallery}
                options={{ title: 'Зургийн цомог' }}
            />
            <Stack.Screen
                name="AlbumImages"
                component={AlbumImages}
                options={{ title: 'Зургийн цомог' }}
            />
            <Stack.Screen
                name="Statistics"
                component={Statistics}
                options={{ title: 'Статистик мэдээлэл' }}
            />
            <Stack.Screen
                name="PhoneList"
                component={PhoneList}
                options={{ title: 'Утасны жагсаалт' }}
            />
            <Stack.Screen
                name="AddChatUsers"
                component={AddChatUsers}
                options={{ title: 'Хэрэглэгч нэмэх' }}
            />
            <Stack.Screen
                name="ApproveLeaveRequest"
                component={ApproveLeaveRequest}
                options={{ title: 'Чөлөөний хүсэлт шийдвэрлэх' }}
            />
            <Stack.Screen
                name="EditRequest"
                component={EditRequest}
                options={{ title: 'Чөлөөний хүсэлт шийдвэрлэх' }}
            />
            <Stack.Screen
                name="SendQuickAnnouncement"
                component={SendQuickAnnouncement}
                options={{ title: 'Шуурхай зар илгээх' }}
            />
            <Stack.Screen
                name="MeetingReview"
                component={MeetingReview}
                options={{ title: 'Хурлын тогтоол' }}
            />
        </Stack.Navigator>
    );
};

export default ScreenLayout;
