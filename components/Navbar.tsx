import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    })();
    const { data } = supabase.auth.onAuthStateChange(() => {
      router.refresh();
    });
    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-pink-600">
          Joalheria
        </Link>
        <div className="flex gap-6">
          <Link href="/" className="text-gray-700 hover:text-pink-600">
            Catálogo
          </Link>
          {user && (
            <>
              <Link
                href="/dashboard"
                className="text-gray-700 hover:text-pink-600"
              >
                Dashboard
              </Link>
              <Link href="/sales" className="text-gray-700 hover:text-pink-600">
                Vender
              </Link>
            </>
          )}
          {user ? (
            <button
              onClick={handleLogout}
              className="text-gray-700 hover:text-red-600"
            >
              Sair
            </button>
          ) : (
            <Link
              href="/login"
              className="text-pink-600 hover:text-pink-500"
            >
              Entrar
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
