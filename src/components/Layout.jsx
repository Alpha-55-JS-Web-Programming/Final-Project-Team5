import { Meta } from "./Meta";
import { AppBar } from "./AppBar";

export function Layout({ selectedAppBarButton, sideBarContent, mainContent, UserProfileDetailsContent }) {
    return (
        <>
            <Meta title={'ZAMO Chat App'}></Meta>

            <div className="lg:flex">
                {/* <!-- Start left sidebar-menu --> */}
                <AppBar selected={selectedAppBarButton} />
                {/* <!-- end left sidebar-menu --> */}

                {sideBarContent && (
                    <div className="chat-leftsidebar lg:w-[380px] group-data-[theme-color=violet]:bg-slate-50 group-data-[theme-color=green]:bg-green-50/20 group-data-[theme-color=red]:bg-red-50/20 shadow overflow-y-hidden mb-[80px] lg:mb-0 group-data-[theme-color=violet]:dark:bg-zinc-700 group-data-[theme-color=green]:dark:bg-zinc-700 group-data-[theme-color=red]:dark:bg-zinc-700">
                        <div>
                            <div className="tab-content active"> {sideBarContent} </div>
                        </div>
                    </div>
                )}

                {/* <!-- Start User chat --> */}
                <div className={`w-full overflow-hidden transition-all duration-150 user-chat dark:bg-zinc-800 ${mainContent && !sideBarContent ? 'bg-slate-50' : ''}`}>
                    {mainContent}
                </div>
                {/* <!-- End User chat --> */}


                {UserProfileDetailsContent && (
                    <div className="chat-rightsidebar lg:w-[380px] group-data-[theme-color=violet]:bg-slate-50 group-data-[theme-color=green]:bg-green-50/20 group-data-[theme-color=red]:bg-red-50/20 shadow overflow-y-hidden mb-[80px] lg:mb-0 group-data-[theme-color=violet]:dark:bg-zinc-700 group-data-[theme-color=green]:dark:bg-zinc-700 group-data-[theme-color=red]:dark:bg-zinc-700">
                        <div>
                            <div className="tab-content active"> {UserProfileDetailsContent} </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}
