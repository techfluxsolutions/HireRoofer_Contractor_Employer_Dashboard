// ============================================
// FILE: components/ChatSidebar.jsx
// ============================================
import React, { useState } from 'react';
import { 
  ConversationItem, 
  UserListItem, 
  EmptyState, 
  ConversationTabs,
  // CreateCrewButton 
} from './ChatModule';

export const ChatSidebar = ({
  conversations,
  users,
  userStatus,
  selectedConversation,
  onSelectConversation,
  onCreateCrew, // Add this prop for creating crews
}) => {
  const [activeTab, setActiveTab] = useState('individual'); // 'individual' or 'crew'
  const[singleSelectedConversation, setSingleSelectedConversation]=useState(null)

  console.log("setSingleSelectedConversation",singleSelectedConversation)
  // Filter conversations based on active tab
  const individualConversations = conversations.filter(conv => 
    conv.type === 'individual' || !conv.type // Default to individual if no type
  );

  console.log("INDIVIDUAL CONVERSATION DATA..",individualConversations)
  
  const crewConversations = conversations.filter(conv => 
    conv.type === 'crew'
  );

  // Ensure arrays are always arrays
  const safeUsers = Array.isArray(users) ? users : [];

  const renderContent = () => {
    if (activeTab === 'individual') {
      return (
        <>
          {/* <div className="flex-1 overflow-y-auto">
            {individualConversations.length === 0 ? (
              <EmptyState
                icon="📭"
                title="No conversations"
                description="Start a new chat!"
              />
            ) : (
              individualConversations.map((conv) => (
                <ConversationItem
                  key={conv._id || Math.random()}
                  conversation={conv}
                  type="individual"
                  isActive={selectedConversation?._id === conv._id}
                  unreadCount={conv.unreadCount || 0}
                  onClick={() => onSelectConversation(conv)}
                />
              ))
            )}
          </div> */}
          
          {/* Users List for Individual Tab */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="font-semibold text-gray-700 px-4 mb-3">👥 Available {`${sessionStorage.getItem("userRole")==='employer'?'Workers' : "Employers"}`}</h3>
            <div className="max-h-48 overflow-y-auto">
              {safeUsers.length === 0 ? (
                <EmptyState
                  icon="🚫"
                  title="No users online"
                  description="Wait for users to come online"
                  className="py-4"
                />
              ) : (
                // safeUsers.map((user) => {
                //   const userObj = user || {};
                //   return (
                //     <UserListItem
                //       key={userObj._id || Math.random()}
                //       user={userObj}
                //       status={userStatus[userObj._id] || { status: 'offline' }}
                //       onClick={() =>
                //       {
                //         setSingleSelectedConversation(userObj)
                //         // onSelectConversation(singleSelectedConversation)
                //         onSelectConversation({
                //           participants: singleSelectedConversation,
                //           displayName: userObj.username || userObj.name || 'User',
                //           type: 'individual'
                //         })
                //       }
                        
                //       }
                //     />
                //   );
                // })

               safeUsers.map((user) => {
  const userObj = user || {};
  return (
    <UserListItem
      key={userObj._id || Math.random()}
      user={userObj}
      status={userStatus[userObj._id] || { status: 'offline' }}
      onClick={() => {
        onSelectConversation({
          participants: [userObj], // wrap in array
          displayName: userObj.username || userObj.name || 'User',
          type: 'individual'
        });
      }}
    />
  );
})


              )}
            </div>
          </div>
        </>
      );
    } else {
      // Crew Tab
      return (
        <>
          {/* <div className="p-4">
            <CreateCrewButton onClick={onCreateCrew} />
          </div> */}
          <div className="flex-1 overflow-y-auto">
            {crewConversations.length === 0 ? (
              <EmptyState
                icon="👥"
                title="No crew chats"
                description="Create a crew to start group conversations"
              />
            ) : (
              crewConversations.map((conv) => (
                <ConversationItem
                  key={conv._id || Math.random()}
                  conversation={conv}
                  type="crew"
                  isActive={selectedConversation?._id === conv._id}
                  unreadCount={conv.unreadCount || 0}
                  onClick={() => onSelectConversation(conv)}
                />
              ))
            )}
          </div>
        </>
      );
    }
  };

  return (
    <aside className="w-80 bg-white rounded-lg shadow-md flex flex-col overflow-hidden">
      {/* Tabs */}
      <ConversationTabs activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* Content based on active tab */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {renderContent()}
      </div>
    </aside>
  );
};