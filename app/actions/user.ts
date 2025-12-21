"use server"

import { prisma } from "@/lib/prisma"
import { Address, UserSettings } from "@/lib/types"

export async function addAddressAction(userId: string, address: Address) {
    try {
        const newAddress = await prisma.address.create({
            data: {
                userId,
                fullName: address.fullName,
                email: address.email,
                phone: address.phone,
                street: address.street,
                city: address.city,
                state: address.state,
                zipCode: address.zipCode,
                country: address.country
            }
        })
        return { address: newAddress }
    } catch (error) {
        console.error("Add address error:", error)
        return { error: "Failed to add address" }
    }
}

export async function removeAddressAction(addressId: string) {
    try {
        await prisma.address.delete({
            where: { id: addressId }
        })
        return { success: true }
    } catch (error) {
        console.error("Remove address error:", error)
        return { error: "Failed to remove address" }
    }
}

export async function editAddressAction(addressId: string, address: Address) {
    try {
        const updatedAddress = await prisma.address.update({
            where: { id: addressId },
            data: {
                fullName: address.fullName,
                email: address.email,
                phone: address.phone,
                street: address.street,
                city: address.city,
                state: address.state,
                zipCode: address.zipCode,
                country: address.country
            }
        })
        return { address: updatedAddress }
    } catch (error) {
        console.error("Edit address error:", error)
        return { error: "Failed to edit address" }
    }
}

export async function updateSettingsAction(userId: string, settings: Partial<UserSettings>) {
    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                notifications: settings.notifications,
                currency: settings.currency,
                marketingEmails: settings.marketingEmails
            },
            select: {
                currency: true,
                notifications: true,
                marketingEmails: true
            } // optimize selection
        })
        return { settings: updatedUser }
    } catch (error) {
        console.error("Update settings error:", error)
        return { error: "Failed to update settings" }
    }
}
export async function updateProfilePictureAction(userId: string, image: string) {
    try {
        await prisma.user.update({
            where: { id: userId },
            // @ts-ignore
            data: { image }
        })
        return { success: true }
    } catch (error) {
        console.error("Update profile picture error:", error)
        return { error: "Failed to update profile picture" }
    }
}
