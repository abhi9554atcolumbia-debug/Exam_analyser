import { useState } from "react";
import { LogOut } from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import Card from "../components/ui/Card";

export default function SignOut() {
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    console.log("Logout");
    // logout logic here
  };

  return (
    <AppLayout showSearch={false} showAddExam={false}>
      <div className="max-w-md mx-auto">
        <Card className="p-8">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <LogOut className="text-red-500" size={28} />
            </div>

            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Sign Out
            </h1>

            <p className="text-sm text-gray-500 mb-8">
              End your current session securely.
            </p>

            <button
              onClick={() => setShowModal(true)}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-medium transition-colors"
            >
              Sign Out
            </button>
          </div>
        </Card>
      </div>

      {/* Logout Confirmation */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-[90%] max-w-sm overflow-hidden shadow-2xl">
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                <LogOut className="text-red-500" size={22} />
              </div>

              <h3 className="text-lg font-semibold text-red-500 mb-2">
                Logout
              </h3>

              <p className="text-sm text-gray-600">
                Are you sure you want to logout?
              </p>
            </div>

            <div className="border-t flex">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 text-gray-500 hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                className="flex-1 py-3 text-indigo-600 hover:bg-indigo-50 font-medium border-l"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}