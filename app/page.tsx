//  app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">

      {/* Hero */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 text-sm font-medium px-4 py-1.5 rounded-full mb-6 border border-indigo-100">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
          Plateforme de mise en relation
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
          Trouvez le bon{" "}
          <span className="bg-gradient-to-r from-indigo-500 to-violet-600 bg-clip-text text-transparent">
            freelance
          </span>
          , la bonne{" "}
          <span className="bg-gradient-to-r from-violet-500 to-indigo-600 bg-clip-text text-transparent">
            mission
          </span>
        </h1>

        <p className="text-lg text-gray-500 mb-10 max-w-xl mx-auto leading-relaxed">
          FreelanceHub connecte clients et freelances pour des collaborations simples, rapides et sécurisées.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/missions"
            className="px-8 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all text-center"
          >
            Voir les missions
          </Link>
          <Link
            href="/register"
            className="px-8 py-3.5 rounded-xl font-semibold text-indigo-600 bg-white border border-indigo-200 hover:bg-indigo-50 transition-all text-center"
          >
            Créer un compte
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20 w-full max-w-4xl">
        {[
          {
            icon: "🎯",
            title: "Missions ciblées",
            desc: "Parcourez des missions adaptées à vos compétences.",
          },
          {
            icon: "💬",
            title: "Chat en temps réel",
            desc: "Communiquez directement avec clients et freelances.",
          },
          {
            icon: "💳",
            title: "Paiements sécurisés",
            desc: "Transactions protégées à chaque étape du projet.",
          },
        ].map(({ icon, title, desc }) => (
          <div
            key={title}
            className="bg-white rounded-2xl p-6 border border-indigo-50 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all"
          >
            <div className="text-3xl mb-3">{icon}</div>
            <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

