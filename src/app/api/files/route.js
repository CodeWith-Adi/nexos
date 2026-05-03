import clientPromise from '../../lib/mongodb';

const DEFAULT_FOLDERS = ["music", "images", "documents", "downloads"];

export async function POST(req) {
  try {
    const body = await req.json();

    const client = await clientPromise;
    const db = client.db("nexos");

    console.log("POST REQUEST:", body);

    if (!DEFAULT_FOLDERS.includes(body.folder)) {
      return Response.json({ success: false, error: "Invalid folder" }, { status: 400 });
    }

    if (body.action === "create_file") {
      const file = {
        name: body.name,
        type: body.type || "text",
        folder: body.folder,
        content: body.content,
        createdAt: new Date()
      };

      const result = await db.collection("files").insertOne(file);

      console.log("FILE SAVED:", result.insertedId);

      return Response.json({
        success: true,
        id: result.insertedId
      });
    }

    return Response.json({ success: false, error: "Invalid action" }, { status: 400 });

  } catch (err) {
    console.error("POST ERROR:", err);

    return Response.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const folder = searchParams.get("folder");

    const client = await clientPromise;
    const db = client.db("nexos");

    if (folder && !DEFAULT_FOLDERS.includes(folder)) {
      return Response.json({ success: false, error: "Invalid folder" }, { status: 400 });
    }

    const query = folder ? { folder } : {};

    const files = await db.collection("files")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return Response.json({
      success: true,
      folders: DEFAULT_FOLDERS,
      files
    });

  } catch (err) {
    console.error("GET ERROR:", err);

    return Response.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}