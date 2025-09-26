import Image from "next/image"

export default function CVMakerPage() {
  return (
    <header className="flex items-center justify-between bg-white shadow-md p-4">
      
      <div className="flex items-center gap-4">
        <Image src="/images/gasnative.webp" alt="CV Maker Logo" width={40} height={40} />
        <a href="/" className="text-xl font-bold text-gray-800">
          CV Maker
        </a>
      </div>

      <nav>
        <ul className="flex items-center gap-8">
          <li><a href="#header" className="text-gray-600 hover:text-blue-500 transition-colors">Header</a></li>
          <li><a href="#section" className="text-gray-600 hover:text-blue-500 transition-colors">Section</a></li>
          <li><a href="#footer" className="text-gray-600 hover:text-blue-500 transition-colors">Footer</a></li>
        </ul>
      </nav>

      <div className="flex items-center gap-6">
        <a href="/" className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
          See CV
        </a>
        <button className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer">Save</button>
      </div>

    </header>
  )
}