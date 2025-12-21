
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
})

async function main() {
    try {
        await prisma.$connect()
        console.log('Successfully connected to the database')

        // Test a query
        const userCount = await prisma.user.count()
        console.log(`Found ${userCount} users`)
    } catch (e) {
        console.error('Error connecting to database:', e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
