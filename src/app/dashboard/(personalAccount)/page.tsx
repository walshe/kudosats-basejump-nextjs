export default function PersonalAccountPage() {
    return (
        <div className="flex flex-col gap-y-6 py-12 h-full w-full items-center justify-center content-center max-w-screen-lg mx-auto text-center">
            <div className="text-6xl mb-4">⚡</div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Welcome to KudoSats!
            </h1>
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-6 max-w-md">
                <p className="text-lg text-gray-700 mb-4">
                    KudoSats is all about <span className="font-semibold text-orange-600">team rewards</span>! 
                </p>
                <p className="text-gray-600 mb-4">
                    Select your team from the dropdown above to start sending kudos and sats to your teammates.
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <span>👆</span>
                    <span>Choose a team to get started</span>
                </div>
            </div>
            <div className="text-2xl">🎯 🚀 💰</div>
        </div>
    )
}