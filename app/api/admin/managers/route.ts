import { NextRequest, NextResponse } from "next/server";
import { LogError } from "@/lib/logger";
import { isWriteConfigured } from "@/lib/admin/cma";
import { requireManager } from "@/lib/admin/session";
import {
  type ManagerRole,
  inviteManager,
  managerById,
  ownerCount,
  revokeManager,
  setManagerRole,
} from "@/lib/admin/managers";

const notFound = () => NextResponse.json({ message: "Not found." }, { status: 404 });

export async function POST(request: NextRequest) {
  const owner = await requireManager("owner");
  if (!owner) return notFound();
  if (!isWriteConfigured()) {
    return NextResponse.json({ message: "Contentful is not connected." }, { status: 503 });
  }

  let body: { email?: string; name?: string; role?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Something went wrong. Try again." }, { status: 400 });
  }

  const role: ManagerRole = body.role === "owner" ? "owner" : "manager";

  try {
    const result = await inviteManager({
      email: String(body.email ?? ""),
      name: String(body.name ?? ""),
      role,
      invitedByEmail: owner.email,
    });

    if ("error" in result) {
      return NextResponse.json({ message: result.error }, { status: 400 });
    }

    const link = new URL(`/admin/invite/${result.token}`, request.nextUrl.origin).toString();
    return NextResponse.json({ ok: true, link, manager: result.manager });
  } catch (error) {
    LogError("[admin/managers] invite", error);
    return NextResponse.json({ message: "Could not send that invite." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const owner = await requireManager("owner");
  if (!owner) return notFound();

  let body: { id?: string; role?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Something went wrong. Try again." }, { status: 400 });
  }

  const id = String(body.id ?? "");
  const role: ManagerRole = body.role === "owner" ? "owner" : "manager";

  if (id === owner.id) {
    return NextResponse.json(
      { message: "You cannot change your own role." },
      { status: 400 }
    );
  }

  const target = await managerById(id);
  if (!target) return NextResponse.json({ message: "That person is gone." }, { status: 404 });

  if (target.role === "owner" && role !== "owner" && (await ownerCount()) <= 1) {
    return NextResponse.json(
      { message: "There has to be at least one owner." },
      { status: 400 }
    );
  }

  try {
    await setManagerRole(id, role);
    return NextResponse.json({ ok: true });
  } catch (error) {
    LogError("[admin/managers] role", error);
    return NextResponse.json({ message: "Could not save that change." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const owner = await requireManager("owner");
  if (!owner) return notFound();

  let body: { id?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Something went wrong. Try again." }, { status: 400 });
  }

  const id = String(body.id ?? "");

  if (id === owner.id) {
    return NextResponse.json(
      { message: "You cannot remove your own access." },
      { status: 400 }
    );
  }

  const target = await managerById(id);
  if (!target) return NextResponse.json({ message: "That person is gone." }, { status: 404 });

  if (target.role === "owner" && target.status === "active" && (await ownerCount()) <= 1) {
    return NextResponse.json(
      { message: "There has to be at least one owner." },
      { status: 400 }
    );
  }

  try {
    await revokeManager(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    LogError("[admin/managers] revoke", error);
    return NextResponse.json({ message: "Could not remove that person." }, { status: 500 });
  }
}
