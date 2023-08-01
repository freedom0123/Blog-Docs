---
title: 第2节 AOP
date: 2023-02-28 20:32:12
permalink: /pages/dda959/
author: 
  name: Hao Long
---
# 1. 静态代理
## 1.1 代理设计模式

1. 通过代理类，为目标类添加额外的功能
2. 好处：利于目标类的维护
## 1.2 名词解释

1. 目标类：业务类
2. 目标方法：目标类中的方法，就是目标方法
3. 额外功能（附加功能）：一般是指 日志，事务，性能
## 1.3 代理开发的核心要素

1. 代理类 =  目标类  + 额外功能  + 目标类实现相同的接口
## 1.4 编码
> 有一个原始类，就有一个代理类，这里的代理类是手动编写的

- 创建Service接口
```java
public interface UserService {
    boolean login(User user);
    boolean register(User user);
}
```

- 创建Service接口的实现类ServiceImpl
```java
public class UserServiceImpl implements UserService {
    @Override
    public boolean login(User user) {
        System.out.println("UserServiceImpl.login");
        return true;
    }

    @Override
    public boolean register(User user) {
        System.out.println("UserServiceImpl.register");
        return true;
    }
}
```

- 创建代理类
```java
public class UserServiceProxy implements UserService{
    private UserServiceImpl userService = new UserServiceImpl();
    @Override
    public boolean login(User user) {
        System.out.println("--------日志--------------");
        return userService.login(user);
    }

    @Override
    public boolean register(User user) {
        System.out.println("--------日志--------------");
        return userService.register(user);
    }
}
```

- 创建测试类，这里new的是代理类
```java
UserService userService = new UserServiceProxy();
User user = new User();
userService.login(user);
userService.register(user);
```
## 1.5 存在的问题

1. 静态类的文件数量过多，不利于项目管理 
- 通过上面可以发现，一个Service类需要一个代理类，当Service类增加的时候，代理类的数量也随之增加，类的数量成倍增加
2. 代理类中， 额外功能维护性较差
# 2. 动态代理
## 2.1 基础信息

1. 概念：通过代理类为原始类（目标类）添加额外功能
2. 好处：利用原始类的维护
3. 开发步骤 
   1. 创建目标对象
   2. 添加额外功能
   3. 定义切入点
   4. 进行组装
## 2.2 搭建开发环境

1. **添加依赖**
```xml
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-aop</artifactId>
    <version>5.2.17.RELEASE</version>
</dependency>

<dependency>
    <groupId>org.aspectj</groupId>
    <artifactId>aspectjweaver</artifactId>
    <version>1.9.8.M1</version>
    <scope>runtime</scope>
</dependency>

<dependency>
    <groupId>aspectj</groupId>
    <artifactId>aspectjrt</artifactId>
    <version>1.5.3</version>
</dependency>
```

2. **创建原始类**
```java
public interface OrderService {
    void order(Order order);
}
```
```java
public class OrderServiceImpl implements OrderService {
    @Override
    public void order(Order order) {
        System.out.println("OrderServiceImpl.order");
    }
}
```
```xml
 <bean id="orderService" class="com.spring.proxy.OrderServiceImpl"></bean>
```

3. **额外功能**
- `MethodeBeforeAdvice `接口：额外功能书写在接口的实现之中 ，同样这个方法中使用invoke方法进行方法执行，就会导致方法执行两次，通过这个就可以说明该方法只能在目标方法之前添加功能。

![image.png](https://cdn.nlark.com/yuque/0/2022/png/22570918/1662340925147-90e827b9-a4d0-462f-9218-59ad2b39b1d0.png#clientId=u2bc445a5-ec5c-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=511&id=u34c40b89&margin=%5Bobject%20Object%5D&name=image.png&originHeight=651&originWidth=1604&originalType=binary&ratio=1&rotation=0&showTitle=false&size=106149&status=done&style=none&taskId=u897a7119-1975-431f-9010-9b971546028&title=&width=1258.0392392109748)
```java
import org.springframework.aop.MethodBeforeAdvice;
import java.lang.reflect.Method;

public class Before implements MethodBeforeAdvice {
    @Override
    public void before(Method method, Object[] objects, Object o) throws Throwable {
        System.out.println("methode before advice 提供日志");
    }
}
```

- 在Spring的配置文件进行注册
```xml
<bean id="before" class="com.spring.proxy.Before"></bean>
```

4. **定义切入点**
   1. 切入点：额外功能加入的位置
   2. 目的：程序员根据自己的需求，决定额外功能所要加给哪一个方法
```xml
<aop:config>
    <aop:pointcut id="pc" expression="execution(* *(..))"></aop:pointcut>
</aop:config>
```

5. **组装**
- 将步骤 三 和 步骤 四 进行整合，也就是额外功能和切入点
```xml
<aop:config>
     <aop:pointcut id="pc" expression="execution(* *(..))"></aop:pointcut>
     <aop:advisor advice-ref="before" pointcut-ref="pc"></aop:advisor>
</aop:config>
```

6. **调用**
   1. 目的：获得Spring工厂所创建的动态代理对象，并进行调用
   2. Spring工厂通过原始对象的** id值 **获得的是**代理对象**
   3. 获得代理对象之后，可以通过声明接口类型，进行对象的存储
## 2.3 动态代理细节分析
> **Spring创建的动态代理类到底在哪里?**

1. Spring框架在运行时，  通过**动态字节码**技术， 在JVM创建的，  运行在JVM内部，  等程序结束后， 会和JVM一起消失 
   1. 动态字节码：通过第三方动态字节码框架，在JVM中创建对应类的字节码，进而创建对象，当虚拟机结束之后，动态字节码跟着消失
2. 动态代理不需要定义类文件，都是JVM在运行过程中动态创建的，所以说不会造成静态代理，类文件数量过多，影响项目管理的问题
3. 在额外功能不改变的前提之下，创建其他目标类(原始类)的代理对象，只需要指定原始(目标)对象即可
4. 动态代理额外功能的维护性大大增强
## 2.4 动态代理详解
### 01 MethodBeforeAdvice

1.  作用：额外功能运行在原始方法执行之前，  进行额外功能操作 
2.  需要把运行在原始方法执行之前运行的额外功能，书写在before方法中 
3.  参数 
- `Method`：额外功能所增加给的那个原始方法
- `Object[] args`：额外功能所增加给的那个原始方法的参数
- `Object target`：额外功能所增加给的那个原始对象
### 02 MethodInterceptor
`MethodBeforeAdvice`提供的功能相对于比较单一，只能添加功能到原始方法之前，而现在这种方式可以根据需求添加在原始方式执行之前，之后，或者是前后。
> **实现MethodInterceptor接口**

- 参数：`methodInvocation`，额外功能所增加给的那个原始方法
- 返回值：`Object`原始方法的返回值
   - 将原始方法的返回值，直接作为invoke方法的返回值返回，`MethodeInterceptor`不会影响原始方法的返回值
   - 在实现`invoke方法`不要用原始方法的返回值即可，就可以改变
- `methodeInvocation.proceed()` :原始方法运行

![image.png](https://cdn.nlark.com/yuque/0/2022/png/22570918/1662341152185-18e1994a-61eb-4b20-b327-e8c25a95f8dd.png#clientId=u2bc445a5-ec5c-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=450&id=ub4a0d254&margin=%5Bobject%20Object%5D&name=image.png&originHeight=574&originWidth=1646&originalType=binary&ratio=1&rotation=0&showTitle=false&size=101218&status=done&style=none&taskId=u2fa2b400-9197-4c75-82c5-89699268442&title=&width=1290.9804162975463)
```java
public class Around implements MethodInterceptor {
    /*
    * 参数：额外功能所增加给的哪个原始方法
    * 返回值：原始方法的返回值
    * */
    @Override
    public Object invoke(MethodInvocation methodInvocation) throws Throwable {
        System.out.println("--------额外功能------");
        // 原始方法运行
        Object object =  methodInvocation.proceed();
        System.out.println("--------额外功能------");
        return object;
    }
}

```
## 2.5 切入点表达式
> 切入点额外功能加入的位置

### 01 通配符
| 符号 | 意义 |
| --- | --- |
| * | 0至多个任意字符 |
| .. | 用在方法参数中，表示任意多个参数，用在包名之后，表示当前包以及子包路径 |
| + | 用在类名后，表示当前类以及子类，用在接口之后，表示当前接口以及实现类 |

### 02 方法切入点
```xml
execution( [访问权限 返回值] [方法名(参数列表)] 异常类型)
```

- `execution()`：切入点函数
- 函数中所写的就是切入点表达式
- 访问权限和异常类型一般省略不写

**案例一：定义login方法作为切入点**
```markdown
execution(* login(..))
```
**案例二：定义两个String类型的login方法作为切入点**
```markdown
execution(* login(String,String))
```
**案例三：定义一个方法是User类型的login方法作为切入点**
```xml
execution(* login(com.spring.proxy.User))
```
**案例四：定义一个login方法，参数列表第一个是String的方法作为切入点**
```xml
execution(* login(String,..))
```
**案例五：指定切入点是任何一个以set开头的方法**
```xml
execution(* set*(..))
```
**案例六：指定切入点为任何一个公共方法**
```xml
execution(public * *(..))
```
**案例七：精准定位**
> 修饰符 返回值   包.类.方法(参数)

```xml
execution(* com.spring.proxy.UserService.login(com.spring.proxy.User))
```
### 03 类切入点
> 指定特定类作为切入点，自然这个类中的所有方法，都会加上额外功能

**案例一：给**`**UserserviceImpl**`**类中所有方法都加入额外功能**
```xml
execution(* com.spring.proxy.UserServiceImpl.*(..))
```
### 04 包切入点
> 指定包作为额外功能的加入位置， 自然包中的所有类以及方法都会加上额外功能

**案例一：切入点包中所有的类，必须在proxy包中，但是不能再proxy包的子包中**
```xml
execution(* com.spring.proxy.*.*(..))
```
**案例二：切入点包以及子包都生效**
```markdown
execution(* com.spring.proxy..*.*(..))
```
## 2.6 切入点函数
作用：用于执行切入点表达式
### 01 execution

1. 最为重要的切入点函数，  功能最全，可以执行 **方法切入点表达式**、**类切入点表达式**、**包切入点表达式**；
2. 弊端：书写麻烦
### 02 args

1. 作用：主要用于函数参数的匹配
2. 格式：`args(String,String)`，只能代理方法参数是两个String类型
```xml
<aop:config>
  <aop:pointcut id="pc" expression="args(String,String)"/>
  <aop:advisor advice-ref="dynamicProxy" pointcut-ref="pc"></aop:advisor>
</aop:config>
```
### 03  within

1. 作用：主要用于进行类，包切入点表达式的匹配
2. 案例一
```markdown
切入点: UserServiceImpl 这个类

 # 使用execution
execution(* *..UserServiceImpl.*(..))

# 使用within
within(*..UseserviceImpl)

```

3. 案例二
```markdown
切入点 com.spring.proxy 这个包

# 使用execution
execution(* com.spring.proxy..*.**(..))

# 使用within
within(com.spring.proxy..*)
```
### 04 @annotation
定义注解
```java
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Log {
}

```
在指定方法上加上注解
```java
    @Override
    @Log
    public boolean login(String username, String password) {
        System.out.println("UserServiceImpl.login");
        return true;
    }
```
切入点表达式
```xml
<aop:config>
        <aop:pointcut id="pc" expression="@annotation(com.spring.proxy.Log)"/>
        <aop:advisor advice-ref="around" pointcut-ref="pc"/>
</aop:config>
```
## 2.7 切入点操作的逻辑运算
### 01 and操作
```xml
execution(* login(..)) and args(String,String)
```
### 02 or操作
```xml
execution(* login(..)) or args(String,String)
```
# 3. AOP编程
## 3.1 AOP 概念

1. AOP：面向切面编程  ，Aspect Oriented Programing
- 以切面为基本单位的程序开发，通过切面之间的彼此协作，相互调用，完成程序之间的构建
- 切面 = 切入点 + 额外功能
- 本质就是 Spring 的动态代理开发，通过代理类为原始类添加额外功能
- 好处：利于原始类的维护
- AOP是对OOP的补充
2. OOP：面向对象编程 
- 以对象为基本单位的程序开发，通过对象之间的彼此协作，相互调用，完成程序之间的构建
3. POP：面向过程编程 
- 以过程为基本单位的程序开发，通过过程之间的彼此协作，相互调用，完成程序的构建
## 3.2 AOP编程开发步骤

1. 原始对象
2. 额外功能
3. 切入点
4. 组装切面
## 3.3 切面的名词解释
面 = 点 + 相同性质 ====>  切面 = 切入点 + 额外功能 
## 3.4 AOP的底层实现原理
### 01 核心问题
**问题一：AOP如何创建动态代理类**

1. 使用动态字节码技术

**问题二：Spring的工厂是如何加工创建代理对象**

1. 通过原始对象的id值，获得的是代理对象
### 02 动态代理类的创建
#### 方式一：JDK的动态代理
```java
Proxy.newProxyInstance(classLoader, insterface, invocationHandler)
```
**InvocationHandler**

- 用来书写额外功能，额外功能运行在原始方法执行之前，之后，前后，抛出异常

提供的方法：
```java
Object invoke(Object proxy,Method method,Object[]args){
    
}
- proxy：代表的是代理对象
- Method：额外功能，所添加给的原始方法
- Object[] args : 原始方法的参数
```
**insterface**

- 原始类和代理类实现同一个接口
```java
对象.getClass().getInstance()
```
**classLoader**

1. 作用：借用一个类加载器，创建代理类的Class对象，进而创建代理对象
2. 类加载器的作用
   1. 通过类加载器把对应类的字节码文件加载JVM
   2. 通过类加载器创建类的Class对象，进而创建这个类的对象
3. 如何获得类加载器
   1. 每一个类的.class 文件，自动分配与之对应的ClassLoader

**编码实现**
```java
package com.spring.jdk;
public class TestJDKProxy {
    public static void main(String[] args) {
        // 创建原始对象
        final UserService userService = new UserServiceImpl();
        // JDk 创建动态代理
        InvocationHandler invocationhandler = new InvocationHandler() {
            @Override
            public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
                System.out.println("------Proxy log----------------");
                Object ret = method.invoke(userService,args);
                return ret;
            }
        };
        UserService userServiceTem = (UserService)Proxy.newProxyInstance(
                TestJDKProxy.class.getClassLoader(),
                userService.getClass().getInterfaces(),
                invocationhandler);
        userServiceTem.login(new User());
    }
}
```
#### 方式二：CGlib的动态代理
**解决**：原始类没有实现任何的接口， 但是仍然需要代理类
**原理**：父子继承关系创建代理对象，  原始类作为父类， 代理类作为子类， 这样既可以保证两者方法一致，同时可以在代理类中添加新的实现

- 原始类
```java
public class UserService {
    public void login(String username,String pass){
        System.out.println("UserService.login");
    }
    public void register(String username){
        System.out.println("UserService.register");

    }
}
```

- Cglib动态代理
```java
public class TestCglib {
    public static void main(String[] args) {
        // 没有实现任何接口的UserService
        final UserService userService = new UserService();
        Enhancer enhancer = new Enhancer();
        enhancer.setClassLoader(TestCglib.class.getClassLoader());
        enhancer.setSuperclass(userService.getClass());
        MethodInterceptor methodInterceptor = new MethodInterceptor() {
            @Override
            public Object intercept(Object o, Method method, Object[] objects, MethodProxy methodProxy) throws Throwable {
                System.out.println("-----------Cglib log--------------");
                Object invoke = method.invoke(userService, objects);
                return  invoke;
            }
        };
        enhancer.setCallback(methodInterceptor);
        UserService service = (UserService) enhancer.create();
    }
}

```
#### 两种方式对比

1. **JDK动态代理 **： **通过接口 **创建代理的实现类
2. **Cglib动态代理 **： **通过继承 **父类创建的代理类
## 3.5 Spring对于代理的加工
主要是通过`BeanPostProcessor`将原始类加工为代理类
```xml
 <bean id="beanPostProcessorTest" class="com.spring.jdk.BeanPostProcessorTest" />
 <bean id="userService" class="com.spring.jdk.UserServiceImpl" />
```
```java
package com.spring.jdk;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanPostProcessor;

import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;
public class BeanPostProcessorTest implements BeanPostProcessor {
    @Override
    public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
        return bean;
    }
    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
        final Object tem = bean;
        InvocationHandler invocationHandler = new InvocationHandler() {
            @Override
            public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
                System.out.println("----------BeanPostProcessor-------------");
                Object invoke = method.invoke(tem, args);
                return invoke;
            }
        };
        Proxy.newProxyInstance(BeanPostProcessorTest.class.getClassLoader(),tem.getClass().getInterfaces(),invocationHandler);
        return tem;
    }
}

```
# 4. 基于AspectJ注解的AOP编程
## 4.1 AOP的开发步骤

1. 原始对象
2. 额外功能
3. 切入点
4. 组装切面
## 4.2 实现AOP的步骤
> **底层仍然是JDK的动态代理**

-  **加入依赖**
> spring依赖     aspectj依赖

```xml
<dependency>
    <groupId>org.aspectj</groupId>
    <artifactId>aspectjweaver</artifactId>
    <version>1.9.8.M1</version>
    <scope>runtime</scope>
</dependency>
<!-- https://mvnrepository.com/artifact/aspectj/aspectjrt -->
<dependency>
    <groupId>aspectj</groupId>
    <artifactId>aspectjrt</artifactId>
    <version>1.5.3</version>
</dependency>
```

- **创建目标类**
```java
@Data
public class UserServiceImpl implements UserService {
    private UserDao userDao;
    @Override
    public void login(String username, String password) {
        userDao.login(username,password);
    }
}

```

- **创建切面类**
   - 定义了额外功能 `@Arround`
   - 定义了切面类 `@Aspect`
   - 组装切面
```java
@Aspect
public class MyAspect {
    @Around("execution(* com.spring.aspect..login(..))")
    public Object around(ProceedingJoinPoint joinPoint) throws Throwable {
        System.out.println("------------额外功能---------------");
        Object ret = joinPoint.proceed();
        return ret;
    }
}

```

- **在Spring的配置文件中进行配置**
   - `<aop:aspectj-autoproxy/>`编程：告知Spring使用 基于注解的AOP
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xsi:schemaLocation="http://www.springframework.org/schema/beans 
       http://www.springframework.org/schema/beans/spring-beans.xsd 
       http://www.springframework.org/schema/context 
       https://www.springframework.org/schema/context/spring-context.xsd 
       http://www.springframework.org/schema/aop 
       https://www.springframework.org/schema/aop/spring-aop.xsd">
  
    <bean id="userDao" class="com.spring.aspect.UserDaoImpl"></bean>
    <bean id="userService" class="com.spring.aspect.UserServiceImpl">
        <property name="userDao" ref="userDao"></property>
    </bean>
    <bean id="around" class="com.spring.aspect.MyAspect"></bean>
  
    <aop:aspectj-autoproxy/>
</beans>
```
## 4.3 切入点复用

- 当我们想为 login方法添加其他的额外功能
```java
@Aspect
public class MyAspect {
    @Around("execution(* com.spring.aspect..login(..))")
    public Object around(ProceedingJoinPoint joinPoint) throws Throwable {
        System.out.println("------------额外功能---------------");
        Object ret = joinPoint.proceed();
        return ret;
    }

    @Around("execution(* com.spring.aspect..login(..))")
    public Object around1(ProceedingJoinPoint joinPoint) throws Throwable {
        System.out.println("------------日志功能---------------");
        Object ret = joinPoint.proceed();
        return ret;
    }
}
```
我们发现了，切入点表达式冗余，对于冗余的代码，我们可以提取出去
```java
@Aspect
public class MyAspect {
    @Pointcut("execution(* com.spring.aspect..login(..))")
    public void myPointCut(){}
    
    @Around(value = "myPointCut()")
    public Object around(ProceedingJoinPoint joinPoint) throws Throwable {
        System.out.println("------------额外功能---------------");
        Object ret = joinPoint.proceed();
        return ret;
    }

    @Around(value = "myPointCut()")
    public Object around1(ProceedingJoinPoint joinPoint) throws Throwable {
        System.out.println("------------日志功能---------------");
        Object ret = joinPoint.proceed();
        return ret;
    }
}
```
## 4.4 动态代理的创建方式

1. 默认情况下，是使用JDK的动态代理
2. 如果说想使用Cglib的动态代理
```xml
<aop:aspectj-autoproxy proxy-target-class="true"/>
```

3. 传统方式使用Cglib
```xml
<aop:config proxy-target-class="true">
    <aop:pointcut id="pc" expression="@annotation(com.spring.proxy.Log)"/>
    <aop:advisor advice-ref="around" pointcut-ref="pc"/>
</aop:config>
```
## 4.5 切面的执行时间

1. 这个执行时间在规范中叫做通知，同时也可以在xml文件的标签中进行使用
2. 常用的注解
- @Before  
- @AfterReturning  
- @Around  
- @AfterThrowing  
- @After  
## 4.6 注意事项

- 在同一个业务类中，进行业务方法的相互调用，只有最外层的方法，才是加入了额外功能。如果说想让内层的方法同时加入，需要通过下面的方式
```java
@Data
public class UserServiceImpl implements UserService, ApplicationContextAware {
    private UserDao userDao;
    private ApplicationContext ac;
    @Override
    public void login(String username, String password) {
        userDao.login(username,password);
        UserService userService = (UserService) ac.getBean("userService");
        userService.register(username,password);
    }

    @Override
    public void register(String username, String password) {
        userDao.register(username,password);
    }

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        this.ac = applicationContext;
    }
}

```

# 4. 总览
![AOP.drawio.png](https://cdn.nlark.com/yuque/0/2022/png/22570918/1662452219740-a943f95e-13a5-4048-adc8-18ec6614e917.png)
