import { doc, getDoc } from "firebase/firestore";
import { serverDb } from "../../../lib/firebase-server";
import ProductLandingClient from "../../../components/ProductLandingClient";
import { formatSum } from "../../../lib/utils";

export async function generateMetadata({ params }) {
  try {
    const snap = await getDoc(doc(serverDb, "products", params.id));
    if (!snap.exists()) {
      return { title: "Mahsulot topilmadi | ZiyoMarket" };
    }
    const p = snap.data();
    const price = p.discountPrice || p.price;
    const description = p.description || `Narxi: ${formatSum(price)}. ZiyoMarket'da xarid qiling.`;

    return {
      title: `${p.name} | ZiyoMarket`,
      description,
      openGraph: {
        title: p.name,
        description,
        images: p.image ? [{ url: p.image }] : [],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: p.name,
        description,
        images: p.image ? [p.image] : [],
      },
    };
  } catch (e) {
    return { title: "ZiyoMarket" };
  }
}

export default function ProductPage({ params }) {
  return <ProductLandingClient productId={params.id} />;
}
